import React from "react";
import { Tile, Direction } from "../lib/types";
import { getRotatedConnections, areTilesMutuallyConnected } from "../lib/tileConnections";

interface BeamRendererProps {
  grid: Tile[];
  poweredTileIds: Set<string>;
  traversalOrder: string[];
}

interface PathData {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function BeamRenderer({ grid, poweredTileIds, traversalOrder }: BeamRendererProps) {
  if (grid.length === 0) return null;

  const paths: PathData[] = [];

  // Generate paths along traversal direction
  traversalOrder.forEach((tileId) => {
    const tile = grid.find((t) => t.id === tileId);
    if (!tile) return;

    const tileIdx = traversalOrder.indexOf(tileId);

    // Get active rotated connections
    const activeDirs = getRotatedConnections(tile.baseConnections, tile.rotation);

    activeDirs.forEach((dir) => {
      let targetRow = tile.row;
      let targetCol = tile.col;

      if (dir === "top") targetRow--;
      else if (dir === "bottom") targetRow++;
      else if (dir === "left") targetCol--;
      else if (dir === "right") targetCol++;

      const neighbor = grid.find((t) => t.row === targetRow && t.col === targetCol);
      if (neighbor && poweredTileIds.has(neighbor.id)) {
        const neighborIdx = traversalOrder.indexOf(neighbor.id);

        // Draw path in the direction of traversal (from lower index to higher index)
        if (neighborIdx > tileIdx) {
          if (areTilesMutuallyConnected(tile, neighbor, dir)) {
            // Coordinate mapping (100 units per cell, center at +50)
            const x1 = tile.col * 100 + 50;
            const y1 = tile.row * 100 + 50;
            const x2 = neighbor.col * 100 + 50;
            const y2 = neighbor.row * 100 + 50;

            paths.push({
              id: `${tile.id}-${neighbor.id}`,
              x1,
              y1,
              x2,
              y2,
            });
          }
        }
      }
    });
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <svg
        viewBox="0 0 700 700"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow filters */}
        <defs>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {paths.map((path) => (
          <g key={path.id}>
            {/* Outer neon pulse */}
            <line
              x1={path.x1}
              y1={path.y1}
              x2={path.x2}
              y2={path.y2}
              stroke="#06b6d4"
              strokeWidth={5}
              strokeLinecap="round"
              opacity={0.7}
              filter="url(#neon-glow)"
              className="beam-glowing-glow"
            />
            {/* Inner flowing pulse core */}
            <line
              x1={path.x1}
              y1={path.y1}
              x2={path.x2}
              y2={path.y2}
              stroke="#e0f7fa"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="12, 18"
              className="beam-flowing-core"
            />
          </g>
        ))}
      </svg>

      <style jsx global>{`
        @keyframes beamFlow {
          from {
            stroke-dashoffset: 30;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes beamPulse {
          0%, 100% {
            opacity: 0.6;
            stroke-width: 5px;
          }
          50% {
            opacity: 0.85;
            stroke-width: 7px;
          }
        }
        .beam-flowing-core {
          animation: beamFlow 1.2s linear infinite;
        }
        .beam-glowing-glow {
          animation: beamPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
