import React from "react";

interface TransmissionPanelProps {
  story: string[];
}

export function TransmissionPanel({ story }: TransmissionPanelProps) {
  return (
    <div className="w-full border border-zinc-800/80 bg-zinc-950/60 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden flex flex-col font-mono text-zinc-400 text-xs md:text-sm leading-relaxed max-w-2xl">
      {/* Decorative frame corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-500/30 rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-500/30 rounded-tr-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-500/30 rounded-bl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-500/30 rounded-br-2xl pointer-events-none" />

      <div className="text-[10px] tracking-wider text-cyan-500/40 uppercase mb-4 select-none">
        LOG_RECOVERY_DECRYPTED // SYSTEM_LOG
      </div>

      <div className="space-y-1 select-text selection:bg-cyan-500/20">
        {story.map((line, index) => {
          if (line === "") {
            return <div key={index} className="h-2" />;
          }
          return (
            <p
              key={index}
              className={
                line.startsWith("STATUS:") ||
                line.startsWith("Automatic conversion:") ||
                line === "MORSE CODE" ||
                line === "OFFLINE"
                  ? "text-cyan-400/85 font-semibold"
                  : ""
              }
            >
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}
