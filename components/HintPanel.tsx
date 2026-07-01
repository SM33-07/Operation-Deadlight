import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";

interface HintPanelProps {
  hints: string[];
  hintIndex: number;
}

export function HintPanel({ hints, hintIndex }: HintPanelProps) {
  if (hintIndex < 0) return null;

  return (
    <div className="w-full max-w-md font-mono space-y-3 select-none">
      <div className="text-[10px] tracking-wider text-cyan-500/40 uppercase">
        RECOVERED SYSTEM HINTS // SEQUENCE
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {hints.slice(0, hintIndex + 1).map((hint, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2.5 bg-zinc-950/70 border border-zinc-900 rounded-xl p-3.5"
            >
              <HelpCircle size={14} className="text-cyan-500 mt-0.5 flex-shrink-0 animate-pulse" />
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-cyan-500/50 uppercase">
                  Hint {idx + 1}
                </span>
                <p className="text-[11px] md:text-xs text-zinc-400 whitespace-pre-wrap leading-normal font-sans">
                  {hint}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
