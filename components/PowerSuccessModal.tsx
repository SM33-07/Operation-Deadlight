import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export function PowerSuccessModal({ isOpen, onConfirm }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-500/40 bg-zinc-950 p-6 md:p-8 shadow-[0_0_50px_rgba(16,185,129,0.25)] z-10 text-center font-mono"
          >
            {/* Hologram aesthetic scanline background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-500/[0.02] pointer-events-none" />

            {/* Glowing check icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/40 border border-emerald-500/45 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <CheckCircle2 size={32} />
            </motion.div>

            {/* Diagnostics Title */}
            <div className="text-[10px] tracking-[0.3em] text-emerald-500/60 uppercase mb-2">
              POWER RESTORED // STAGE 2 SECURED
            </div>

            <h2 className="text-xl md:text-2xl font-bold tracking-wider text-emerald-400 uppercase mb-4">
              Authentication Active
            </h2>

            {/* Narrative detail about Case 9 */}
            <div className="text-zinc-400 text-xs leading-relaxed space-y-3 max-w-sm mx-auto mb-8 font-sans">
              <p>
                The facility power grid is fully restored. Subsystems are back online, and the security decryption handshake has finalized.
              </p>
              <p className="font-mono text-[10px] text-emerald-500/50">
                CASE_9_AUTHENTICATED // HUNT_DECRYPTION_SUCCESS
              </p>
            </div>

            {/* Action buttons */}
            <button
              onClick={onConfirm}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 text-black font-bold rounded-xl tracking-widest text-xs transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(52,211,153,0.45)] cursor-pointer active:scale-98"
            >
              <ShieldCheck size={16} />
              <span>RECORD IN ARCHIVE HUB</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
