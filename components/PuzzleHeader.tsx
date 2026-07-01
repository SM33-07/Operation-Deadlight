import React from "react";

interface PuzzleHeaderProps {
  title: string;
  category: string;
}

export function PuzzleHeader({ title, category }: PuzzleHeaderProps) {
  return (
    <div className="w-full flex flex-col items-center text-center font-mono gap-1 mb-6">
      <div className="text-[10px] tracking-[0.4em] text-cyan-500/70 uppercase">
        {category}
      </div>
      <h1 className="text-2xl md:text-3xl font-bold tracking-[0.25em] text-cyan-400 uppercase drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]">
        {title}
      </h1>
      <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-2" />
    </div>
  );
}
