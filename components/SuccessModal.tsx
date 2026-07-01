import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Terminal, AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export function SuccessModal({ isOpen, onConfirm }: SuccessModalProps) {
  const [phase, setPhase] = useState<"decrypting" | "typing" | "done">("decrypting");
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [glitchLines, setGlitchLines] = useState<string[]>([]);
  const fullText = "The Archive Remembers What We Forgot.";

  // Generate random decryption streams
  useEffect(() => {
    if (phase === "decrypting") {
      const lines = [
        "SYS.HANDSHAKE: OK",
        "KEY_DERIVATION: AES-256",
        "INTEGRITY_CHECK: 100%",
        "CORRELATION: COMPLETE",
        "BUFFERING BITSTREAM...",
        "DECRYPTING INDEX POINTERS...",
      ];
      setGlitchLines(lines);

      const streamInterval = setInterval(() => {
        const chars = "0123456789ABCDEF-..//--...";
        let text = "";
        for (let i = 0; i < 20; i++) {
          text += chars[Math.floor(Math.random() * chars.length)];
        }
        setGlitchLines((prev) => [text, ...prev.slice(0, 5)]);
      }, 100);

      return () => clearInterval(streamInterval);
    }
  }, [phase]);

  // Handle Decryption Loading Progress
  useEffect(() => {
    if (isOpen) {
      setPhase("decrypting");
      setProgress(0);
      setTypedText("");

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhase("typing");
            return 100;
          }
          return prev + 5;
        });
      }, 60);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Handle Answer Typewriter Effect
  useEffect(() => {
    if (phase === "typing") {
      let currentIdx = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, currentIdx + 1));
        currentIdx++;
        if (currentIdx >= fullText.length) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase("done");
          }, 800);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-red-500/40 bg-zinc-950 p-6 md:p-8 shadow-[0_0_60px_rgba(239,68,68,0.2)] z-10 font-mono text-center"
          >
            {/* Retro hologram lines */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-500/[0.015] pointer-events-none" />

            {/* PHASE 1: DECRYPTING TERMINAL ANIMATION */}
            {phase === "decrypting" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative flex items-center justify-center h-16 w-16 rounded-full border border-red-500/35 bg-red-950/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <Terminal size={28} className="animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] tracking-[0.3em] text-red-500/70 uppercase">
                    INITIALIZING TERMINAL DECRYPTION
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100 uppercase tracking-widest">
                    DECRYPTING: {progress}%
                  </h3>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Decryption streams code visual */}
                <div className="bg-black/60 border border-zinc-900 rounded-lg p-4 h-32 overflow-hidden text-left text-[9px] text-zinc-500 space-y-1">
                  {glitchLines.map((line, index) => (
                    <div key={index} className="truncate">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PHASE 2: TYPING DECODED MESSAGE */}
            {phase === "typing" && (
              <div className="space-y-6 py-4">
                <div className="text-[10px] tracking-[0.3em] text-cyan-500/80 uppercase animate-pulse">
                  DECODED STREAM DETECTED // STREAMING...
                </div>

                <div className="min-h-[80px] bg-zinc-900/40 border border-zinc-900 rounded-xl p-6 flex flex-col justify-center items-center">
                  <p className="text-cyan-400 font-bold text-base md:text-lg tracking-wide selection:bg-cyan-500/20 leading-relaxed">
                    &quot;{typedText}&quot;
                    <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 animate-ping" />
                  </p>
                </div>
              </div>
            )}

            {/* PHASE 3: FINAL DECRYPTION UNLOCKED AND RESTORATION */}
            {phase === "done" && (
              <div className="space-y-6">
                {/* Glowing warning icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-950/40 border border-red-500/50 text-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)] animate-pulse"
                >
                  <ShieldAlert size={32} />
                </motion.div>

                <div className="space-y-2">
                  <div className="text-[10px] tracking-[0.4em] text-red-500/80 font-bold uppercase">
                    Transmission Verified
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-wider text-red-500 uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                    WARNING RECOVERED
                  </h2>
                </div>

                {/* Warning details */}
                <div className="bg-red-950/15 border border-red-500/25 rounded-2xl p-5 md:p-6 text-zinc-300 space-y-4 shadow-inner">
                  <p className="text-cyan-400 font-bold text-sm md:text-base leading-relaxed tracking-wider">
                    &quot;The Archive Remembers What We Forgot.&quot;
                  </p>
                  <div className="w-12 h-[1px] bg-red-500/30 mx-auto" />
                  <p className="text-[10px] tracking-[0.2em] text-red-400/80 uppercase font-bold">
                    Prevention Protocol Unlocked.
                  </p>
                </div>

                {/* Confirm Action Button */}
                <div className="pt-2">
                  <button
                    onClick={onConfirm}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white font-bold rounded-xl tracking-widest text-xs transition-all duration-300 hover:bg-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] cursor-pointer active:scale-98"
                  >
                    <ShieldCheck size={16} />
                    <span>COMPLETE INTERCEPT & ACTIVATE</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
