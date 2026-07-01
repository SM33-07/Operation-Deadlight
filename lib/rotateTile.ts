import { Tile } from "./types";

export function rotateTile(tile: Tile): Tile {
  if (tile.isFixed) return tile;
  return {
    ...tile,
    rotation: (tile.rotation + 90) % 360,
  };
}
