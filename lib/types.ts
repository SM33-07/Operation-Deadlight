export type TileType =
  | "source"
  | "destination"
  | "checkpoint"
  | "straight"
  | "corner"
  | "t-junction"
  | "cross"
  | "empty";

export type Direction = "top" | "right" | "bottom" | "left";

export interface Tile {
  id: string;
  type: TileType;
  row: number;
  col: number;
  rotation: number; // 0, 90, 180, 270 (degrees clockwise)
  isFixed: boolean;
  baseConnections: Direction[]; // connections when rotation is 0
}
