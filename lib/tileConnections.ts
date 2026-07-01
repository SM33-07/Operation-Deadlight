import { Tile, Direction } from "./types";

export const DIRECTIONS: Direction[] = ["top", "right", "bottom", "left"];

export function getRotatedConnections(baseConnections: Direction[], rotation: number): Direction[] {
  const shift = Math.floor(((rotation % 360) + 360) % 360 / 90);
  return baseConnections.map((dir) => {
    const idx = DIRECTIONS.indexOf(dir);
    if (idx === -1) return dir;
    const newIdx = (idx + shift) % 4;
    return DIRECTIONS[newIdx];
  });
}

export function areTilesMutuallyConnected(
  tileA: Tile,
  tileB: Tile,
  dirFromAToB: Direction
): boolean {
  const activeA = getRotatedConnections(tileA.baseConnections, tileA.rotation);
  const activeB = getRotatedConnections(tileB.baseConnections, tileB.rotation);

  const oppositeDir: Record<Direction, Direction> = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  };

  const dirFromBToA = oppositeDir[dirFromAToB];

  return activeA.includes(dirFromAToB) && activeB.includes(dirFromBToA);
}
