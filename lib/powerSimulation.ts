import { Tile, Direction } from "./types";
import { getRotatedConnections, areTilesMutuallyConnected } from "./tileConnections";

export interface SimulationResult {
  poweredIds: Set<string>;
  traversalOrder: string[];
  isSolved: boolean;
  memoryCorePowered: boolean;
  authCorePowered: boolean;
}

export function runPowerSimulation(grid: Tile[]): SimulationResult {
  const poweredIds = new Set<string>();
  const traversalOrder: string[] = [];

  // Find the source tile
  const source = grid.find((t) => t.type === "source");
  if (!source) {
    return {
      poweredIds,
      traversalOrder,
      isSolved: false,
      memoryCorePowered: false,
      authCorePowered: false,
    };
  }

  // BFS Queue
  const queue: Tile[] = [source];
  const visited = new Set<string>([source.id]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    poweredIds.add(current.id);
    traversalOrder.push(current.id);

    // Find mutually connected neighbors
    const activeDirs = getRotatedConnections(
      current.baseConnections,
      current.rotation
    );

    for (const dir of activeDirs) {
      let targetRow = current.row;
      let targetCol = current.col;

      if (dir === "top") targetRow--;
      else if (dir === "bottom") targetRow++;
      else if (dir === "left") targetCol--;
      else if (dir === "right") targetCol++;

      const neighbor = grid.find(
        (t) => t.row === targetRow && t.col === targetCol
      );

      if (neighbor && !visited.has(neighbor.id)) {
        if (areTilesMutuallyConnected(current, neighbor, dir)) {
          visited.add(neighbor.id);
          queue.push(neighbor);
        }
      }
    }
  }

  // Find Memory Core and Authentication Core
  const memoryCore = grid.find((t) => t.type === "checkpoint");
  const authCore = grid.find((t) => t.type === "destination");

  const memoryCorePowered = memoryCore ? poweredIds.has(memoryCore.id) : false;
  const authCorePowered = authCore ? poweredIds.has(authCore.id) : false;

  // Validation: both cores powered and Memory Core is reached before Auth Core in traversal
  let isSolved = false;
  if (memoryCore && authCore && memoryCorePowered && authCorePowered) {
    const memoryIdx = traversalOrder.indexOf(memoryCore.id);
    const authIdx = traversalOrder.indexOf(authCore.id);
    if (memoryIdx !== -1 && authIdx !== -1 && memoryIdx < authIdx) {
      isSolved = true;
    }
  }

  return {
    poweredIds,
    traversalOrder,
    isSolved,
    memoryCorePowered,
    authCorePowered,
  };
}
