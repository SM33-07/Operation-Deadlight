import React from "react";
import { motion } from "framer-motion";
import { Zap, Cpu, Lock, Unlock } from "lucide-react";
import { Tile } from "../lib/types";

interface PowerTileProps {
  tile: Tile;
  isPowered: boolean;
  isSolved: boolean;
  onClick: (id: string) => void;
}

export function PowerTile({ tile, isPowered, isSolved, onClick }: PowerTileProps) {
  const { type, rotation, isFixed } = tile;

  // Dual-stroke neon glow classes
  const glowColor = isPowered ? "stroke-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "stroke-zinc-800";
  const coreGlow = isPowered ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "text-zinc-600";

  // Click handler
  const handleClick = () => {
    if (!isFixed) {
      onClick(tile.id);
    }
  };

  const renderWire = () => {
    switch (type) {
      case "straight":
        return (
          <>
            {/* Outer Glow */}
            <path
              d="M 0 50 L 100 50"
              fill="none"
              strokeWidth={8}
              strokeLinecap="round"
              className={`transition-colors duration-300 opacity-60 ${
                isPowered ? "stroke-cyan-500/40 blur-[2px]" : "stroke-zinc-900"
              }`}
            />
            {/* Inner Core */}
            <path
              d="M 0 50 L 100 50"
              fill="none"
              strokeWidth={3}
              strokeLinecap="round"
              className={`transition-colors duration-300 ${
                isPowered ? "stroke-cyan-300" : "stroke-zinc-700"
              }`}
            />
          </>
        );

      case "corner":
        return (
          <>
            {/* Curved wire from top (50, 0) to right (100, 50) */}
            <path
              d="M 50 0 Q 50 50 100 50"
              fill="none"
              strokeWidth={8}
              strokeLinecap="round"
              className={`transition-colors duration-300 opacity-60 ${
                isPowered ? "stroke-cyan-500/40 blur-[2px]" : "stroke-zinc-900"
              }`}
            />
            <path
              d="M 50 0 Q 50 50 100 50"
              fill="none"
              strokeWidth={3}
              strokeLinecap="round"
              className={`transition-colors duration-300 ${
                isPowered ? "stroke-cyan-300" : "stroke-zinc-700"
              }`}
            />
          </>
        );

      case "t-junction":
        return (
          <>
            {/* T wire: Left to Right, and Center to Bottom */}
            <path
              d="M 0 50 L 100 50 M 50 50 L 50 100"
              fill="none"
              strokeWidth={8}
              strokeLinecap="round"
              className={`transition-colors duration-300 opacity-60 ${
                isPowered ? "stroke-cyan-500/40 blur-[2px]" : "stroke-zinc-900"
              }`}
            />
            <path
              d="M 0 50 L 100 50 M 50 50 L 50 100"
              fill="none"
              strokeWidth={3}
              strokeLinecap="round"
              className={`transition-colors duration-300 ${
                isPowered ? "stroke-cyan-300" : "stroke-zinc-700"
              }`}
            />
          </>
        );

      case "cross":
        return (
          <>
            {/* Cross wire: Left to Right, Top to Bottom */}
            <path
              d="M 0 50 L 100 50 M 50 0 L 50 100"
              fill="none"
              strokeWidth={8}
              strokeLinecap="round"
              className={`transition-colors duration-300 opacity-60 ${
                isPowered ? "stroke-cyan-500/40 blur-[2px]" : "stroke-zinc-900"
              }`}
            />
            <path
              d="M 0 50 L 100 50 M 50 0 L 50 100"
              fill="none"
              strokeWidth={3}
              strokeLinecap="round"
              className={`transition-colors duration-300 ${
                isPowered ? "stroke-cyan-300" : "stroke-zinc-700"
              }`}
            />
          </>
        );

      case "source":
        return (
          <>
            {/* Connector to Right */}
            <path
              d="M 50 50 L 100 50"
              fill="none"
              strokeWidth={8}
              className={`transition-colors duration-300 opacity-60 ${
                isPowered ? "stroke-cyan-500/40 blur-[2px]" : "stroke-zinc-900"
              }`}
            />
            <path
              d="M 50 50 L 100 50"
              fill="none"
              strokeWidth={3}
              className={`transition-colors duration-300 ${
                isPowered ? "stroke-cyan-300" : "stroke-zinc-700"
              }`}
            />
          </>
        );

      case "checkpoint":
      case "destination":
        return (
          <>
            {/* Core connectors in all 4 directions */}
            <path
              d="M 50 0 L 50 100 M 0 50 L 100 50"
              fill="none"
              strokeWidth={8}
              className={`transition-colors duration-300 opacity-60 ${
                isPowered ? "stroke-cyan-500/40 blur-[2px]" : "stroke-zinc-900"
              }`}
            />
            <path
              d="M 50 0 L 50 100 M 0 50 L 100 50"
              fill="none"
              strokeWidth={3}
              className={`transition-colors duration-300 ${
                isPowered ? "stroke-cyan-300" : "stroke-zinc-700"
              }`}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative aspect-square flex items-center justify-center border select-none transition-all duration-300 ${
        isFixed
          ? "border-zinc-800/40 bg-zinc-950/20"
          : "border-zinc-800/60 bg-zinc-950/40 hover:border-cyan-500/30 hover:bg-cyan-950/5 cursor-pointer active:scale-95 group"
      } ${
        isPowered && !isFixed
          ? "shadow-[0_0_8px_rgba(6,182,212,0.05)] border-cyan-500/20"
          : ""
      }`}
    >
      {/* Corner indicators for mechanical aesthetic */}
      {!isFixed && (
        <>
          <div className="absolute top-1 left-1 w-1 h-1 border-t border-l border-zinc-700 opacity-40 group-hover:opacity-100 group-hover:border-cyan-500 transition-colors" />
          <div className="absolute top-1 right-1 w-1 h-1 border-t border-r border-zinc-700 opacity-40 group-hover:opacity-100 group-hover:border-cyan-500 transition-colors" />
          <div className="absolute bottom-1 left-1 w-1 h-1 border-b border-l border-zinc-700 opacity-40 group-hover:opacity-100 group-hover:border-cyan-500 transition-colors" />
          <div className="absolute bottom-1 right-1 w-1 h-1 border-b border-r border-zinc-700 opacity-40 group-hover:opacity-100 group-hover:border-cyan-500 transition-colors" />
        </>
      )}

      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

      {/* SVG Wire Layout */}
      <motion.div
        animate={{ rotate: rotation }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="w-full h-full flex items-center justify-center"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {renderWire()}
        </svg>
      </motion.div>

      {/* Central Core Overlay for Special Tiles */}
      {type === "source" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-1/2 h-1/2 rounded-full border flex items-center justify-center transition-all duration-300 ${
              isPowered
                ? "bg-cyan-950/60 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-zinc-950 border-zinc-700"
            }`}
          >
            <Zap size={14} className={coreGlow} />
          </div>
        </div>
      )}

      {type === "checkpoint" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-1/2 h-1/2 rounded-lg border flex items-center justify-center transition-all duration-300 ${
              isPowered
                ? "bg-cyan-950/60 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-zinc-950 border-zinc-700"
            }`}
          >
            <Cpu size={14} className={coreGlow} />
          </div>
          {/* Diagnostic floating texts for tech vibe */}
          <span className="absolute bottom-1 font-mono text-[7px] tracking-tighter text-zinc-600 scale-90">
            MEM_CORE
          </span>
        </div>
      )}

      {type === "destination" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-1/2 h-1/2 rounded-lg border flex items-center justify-center transition-all duration-300 ${
              isSolved
                ? "bg-emerald-950/60 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : isPowered
                ? "bg-cyan-950/60 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-zinc-950 border-zinc-700"
            }`}
          >
            {isSolved ? (
              <Unlock size={14} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            ) : (
              <Lock size={14} className={coreGlow} />
            )}
          </div>
          <span className="absolute bottom-1 font-mono text-[7px] tracking-tighter text-zinc-600 scale-90">
            AUTH_CORE
          </span>
        </div>
      )}
    </div>
  );
}
