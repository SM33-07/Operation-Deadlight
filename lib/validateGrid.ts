import { Tile } from "./types";
import { runPowerSimulation, SimulationResult } from "./powerSimulation";

export function validateGrid(grid: Tile[]): SimulationResult {
  return runPowerSimulation(grid);
}
