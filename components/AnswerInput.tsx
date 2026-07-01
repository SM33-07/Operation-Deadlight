import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Terminal, CornerDownLeft, AlertCircle, HelpCircle } from "lucide-react";

interface AnswerInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  error: boolean;
  disabled?: boolean;
}

export function AnswerInput({
  value,
  onChange,
  onSubmit,
  onHint,
  error,
  disabled = false,
}: AnswerInputProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (error) {
      controls.start({
        x: [0, -10, 10, -10, 10, -5, 5, 0],
        transition: { duration: 0.4 },
      });
    }
  }, [error, controls]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit();
  };

  return (
    <div className="w-full max-w-md font-mono space-y-4">
      <motion.form animate={controls} onSubmit={handleSubmit} className="relative group">
        {/* Glow background */}
        <div
          className={`absolute inset-0 -m-[1px] rounded-xl bg-gradient-to-r ${
            error ? "from-red-500/20 to-red-500/30" : "from-cyan-500/10 to-cyan-500/20"
          } opacity-75 blur-sm transition-all duration-300 group-hover:opacity-100`}
        />

        <div
          className={`relative flex items-center bg-zinc-950/90 border rounded-xl overflow-hidden px-4 py-2.5 transition-colors duration-300 ${
            error ? "border-red-500/50" : "border-cyan-500/30 group-hover:border-cyan-400/50"
          }`}
        >
          {/* Terminal/Archive Prompt indicator */}
          <span className="text-zinc-600 mr-3 select-none flex items-center">
            <Terminal size={16} className={error ? "text-red-500" : "text-cyan-500"} />
            <span className="ml-1 text-xs text-zinc-500 font-bold">{">"}</span>
          </span>

          {/* Answer Input text field */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Decoded Transmission"
            disabled={disabled}
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-800 outline-none border-none py-1 uppercase font-semibold tracking-widest disabled:text-zinc-600"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      </motion.form>

      {/* Buttons and Error feedback */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 select-none">
        {/* Error message */}
        <div className="min-h-[20px] flex items-center">
          {error && (
            <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-semibold uppercase tracking-wider animate-pulse">
              <AlertCircle size={12} />
              <span>INVALID DECRYPTION SIGNATURE</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Hint Button */}
          <button
            type="button"
            onClick={onHint}
            disabled={disabled}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 disabled:border-zinc-800 text-zinc-400 hover:text-cyan-400 disabled:text-zinc-700 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95 disabled:cursor-not-allowed"
          >
            <HelpCircle size={12} />
            <span>Hint</span>
          </button>

          {/* Submit Button */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled || !value.trim()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-cyan-950/50 border border-cyan-500/40 hover:border-cyan-450 hover:bg-cyan-500/25 disabled:bg-transparent disabled:border-zinc-800 text-cyan-400 hover:text-cyan-200 disabled:text-zinc-700 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95"
          >
            <span>Submit</span>
            <CornerDownLeft size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
