import React from "react";
import { Cpu, ShieldCheck, ShieldAlert, Power } from "lucide-react";

interface GridStatusProps {
  memoryCorePowered: boolean;
  authCorePowered: boolean;
  isSolved: boolean;
}

export function GridStatus({
  memoryCorePowered,
  authCorePowered,
  isSolved,
}: GridStatusProps) {
  return (
    <div className="w-full max-w-sm flex flex-col gap-6 font-mono text-zinc-300">
      {/* Narrative block */}
      <div className="border border-cyan-500/25 bg-cyan-950/10 p-5 rounded-2xl relative overflow-hidden backdrop-blur-md">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-3 mb-3 text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
          <Power size={12} className="animate-pulse" />
          <span>GRID DECIPHER MODULE // PR-02</span>
        </div>

        <p className="text-xs leading-relaxed text-zinc-400 mb-2">
          The secondary routing junction is damaged. Power has collapsed to the primary security subsystems.
        </p>
        <p className="text-xs leading-relaxed text-cyan-500/70 font-semibold">
          Task: Align redirectors to route a high-voltage beam from the Main Power Source through the Memory Core first, then to the Authentication Core to bypass lock protocols.
        </p>
      </div>

      {/* Connection Protocol Diagnostics */}
      <div className="border border-zinc-800/80 bg-zinc-950/40 p-5 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 border-b border-zinc-800/60 pb-2">
          SUB-CORE STATUS
        </h3>

        <div className="space-y-4">
          {/* Memory Core */}
          <div className="flex items-center justify-between gap-4 p-3 border border-zinc-900 bg-zinc-950/60 rounded-xl">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg border transition-all duration-300 ${
                  memoryCorePowered
                    ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                    : "bg-zinc-950 border-zinc-800 text-zinc-600"
                }`}
              >
                <Cpu size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wide">
                  Memory Core
                </span>
                <span className="text-[9px] text-zinc-500">
                  SYS.VOLT: {memoryCorePowered ? "480V [MAX]" : "0V [DEAD]"}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              {memoryCorePowered ? (
                <span className="px-2.5 py-0.5 border border-cyan-500/40 bg-cyan-950/30 text-cyan-400 text-[9px] font-bold rounded shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                  ✓ ONLINE
                </span>
              ) : (
                <span className="px-2.5 py-0.5 border border-zinc-800 bg-zinc-900/40 text-zinc-500 text-[9px] font-bold rounded">
                  ✕ OFFLINE
                </span>
              )}
            </div>
          </div>

          {/* Authentication Core */}
          <div className="flex items-center justify-between gap-4 p-3 border border-zinc-900 bg-zinc-950/60 rounded-xl">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg border transition-all duration-300 ${
                  isSolved
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                    : authCorePowered
                    ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                    : "bg-zinc-950 border-zinc-800 text-zinc-600"
                }`}
              >
                {isSolved ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-wide">
                  Auth Core
                </span>
                <span className="text-[9px] text-zinc-500">
                  DECRYPT: {isSolved ? "COMPLETED" : "BLOCKED"}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              {isSolved ? (
                <span className="px-2.5 py-0.5 border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 text-[9px] font-bold rounded shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                  ✓ ACTIVE
                </span>
              ) : authCorePowered ? (
                <span className="px-2.5 py-0.5 border border-amber-500/40 bg-amber-950/20 text-amber-500 text-[9px] font-bold rounded group animate-pulse">
                  ⚠ BYPASS LOCKED
                </span>
              ) : (
                <span className="px-2.5 py-0.5 border border-zinc-800 bg-zinc-900/40 text-zinc-500 text-[9px] font-bold rounded">
                  ✕ OFFLINE
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Warning text if auth is powered before memory */}
        {authCorePowered && !memoryCorePowered && (
          <div className="mt-4 p-2.5 border border-amber-500/20 bg-amber-950/10 rounded-lg text-[9px] text-amber-500 leading-normal">
            ▲ SECURITY LOCKOUT: Authentication Core reached but Memory Core was not decrypted first. Traversal flow is invalid. Complete circuit from Source → Memory → Auth.
          </div>
        )}
      </div>
    </div>
  );
}
