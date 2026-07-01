import { useState, useEffect, useCallback, useRef } from "react";
import { Tile } from "../lib/types";
import { DEFAULT_POWER_GRID } from "../data/powerGrid";
import { runPowerSimulation, SimulationResult } from "../lib/powerSimulation";
import { rotateTile } from "../lib/rotateTile";
import { usePowerAudio } from "./usePowerAudio";

export function usePowerGrid() {
  const { playRotate, playElectricity, playBeamActive, playSolved } = usePowerAudio();

  const [grid, setGrid] = useState<Tile[]>([]);
  const [simulation, setSimulation] = useState<SimulationResult>({
    poweredIds: new Set<string>(),
    traversalOrder: [],
    isSolved: false,
    memoryCorePowered: false,
    authCorePowered: false,
  });

  // Track previous powered states to play SFX when nodes activate
  const prevMemoryPowered = useRef(false);
  const prevAuthPowered = useRef(false);
  const prevSolved = useRef(false);

  // Initialize and randomize the grid ensuring it starts unsolved
  const resetGrid = useCallback(() => {
    let randomized = DEFAULT_POWER_GRID.map((tile) => {
      if (tile.isFixed) {
        return { ...tile };
      }
      const rotations = [0, 90, 180, 270];
      const randomRot = rotations[Math.floor(Math.random() * rotations.length)];
      return { ...tile, rotation: randomRot };
    });

    // Make sure we do not start in a solved state
    let attempts = 0;
    while (runPowerSimulation(randomized).isSolved && attempts < 100) {
      randomized = DEFAULT_POWER_GRID.map((tile) => {
        if (tile.isFixed) return { ...tile };
        const rotations = [0, 90, 180, 270];
        const randomRot = rotations[Math.floor(Math.random() * rotations.length)];
        return { ...tile, rotation: randomRot };
      });
      attempts++;
    }

    setGrid(randomized);
    prevMemoryPowered.current = false;
    prevAuthPowered.current = false;
    prevSolved.current = false;
  }, []);

  // Initialize on mount
  useEffect(() => {
    resetGrid();
  }, [resetGrid]);

  // Run simulation whenever the grid layout rotates
  useEffect(() => {
    if (grid.length === 0) return;

    const result = runPowerSimulation(grid);
    setSimulation(result);

    // Audio cues for core activations
    if (result.memoryCorePowered && !prevMemoryPowered.current) {
      playBeamActive();
    } else if (!result.memoryCorePowered && prevMemoryPowered.current) {
      playElectricity();
    }

    if (result.authCorePowered && !prevAuthPowered.current) {
      playBeamActive();
    }

    if (result.isSolved && !prevSolved.current) {
      playSolved();
    }

    prevMemoryPowered.current = result.memoryCorePowered;
    prevAuthPowered.current = result.authCorePowered;
    prevSolved.current = result.isSolved;
  }, [grid, playBeamActive, playElectricity, playSolved]);

  // Triggered when a player clicks a tile to rotate it
  const handleRotateTile = useCallback(
    (tileId: string) => {
      playRotate();
      setGrid((prevGrid) =>
        prevGrid.map((tile) => {
          if (tile.id === tileId) {
            return rotateTile(tile);
          }
          return tile;
        })
      );
    },
    [playRotate]
  );

  return {
    grid,
    poweredTileIds: simulation.poweredIds,
    traversalOrder: simulation.traversalOrder,
    isSolved: simulation.isSolved,
    memoryCorePowered: simulation.memoryCorePowered,
    authCorePowered: simulation.authCorePowered,
    rotateTile: handleRotateTile,
    resetGrid,
  };
}
