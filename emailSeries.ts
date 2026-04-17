import React from "react";
import { motion } from "framer-motion";
import { TestResultData } from "../utils/testScoring";
import { ArrowRight, ShieldAlert, ShieldCheck, Shield, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

interface TestResultProps {
  result: TestResultData;
  onRestart: () => void;
}

export default function TestResult({ result, onRestart }: TestResultProps) {
  const getLevelColor = () => {
    if (result.level === "solide") return "text-green-500";
    if (result.level === "modere") return "text-ngt-gold";
    return "text-red-500";
  };

  const getLevelIcon = () => {
    if (result.level === "solide") return <ShieldCheck size={48} className="text-green-500" />;
    if (result.level === "modere") return <Shield size={48} className="text-ngt-gold" />;
    return <ShieldAlert size={48} className="text-red-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl mx-auto text-center"
    >
      <div className="mb-12 flex flex-col items-center">
        <motion.div
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          {getLevelIcon()}
        </motion.div>
        
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-ngt-white/40 mb-2">
          Votre Diagnostic Psychologique
        </h2>
        <h3 className={`text-4xl md:text-5xl font-serif italic mb-8 ${getLevelColor()}`}>
          {result.level === "solide" ? "Profil Solide" : result.level === "modere" ? "Affecté Modéré" : "Affecté Critique"}
        </h3>

        <div className="relative w-48 h-48 mb-12">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-ngt-white/5"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * result.score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={getLevelColor()}
              style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-serif gold-text">{result.score}%</span>
            <span className="text-[8px] uppercase tracking-widest text-ngt-white/30">Affectation</span>
          </div>
        </div>
      </div>

      <div className="bg-ngt-white/[0.02] border border-ngt-white/10 p-8 md:p-12 mb-12 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          {getLevelIcon()}
        </div>
        <p className="text-ngt-white/70 leading-relaxed mb-8 text-lg">
          {result.recommendation}
        </p>
        
        <Link 
          to={result.ctaLink}
          className="inline-flex items-center gap-3 px-8 py-4 bg-ngt-gold text-ngt-black text-[10px] uppercase tracking-widest font-bold gold-gradient hover:scale-[1.02] transition-transform"
        >
          {result.ctaText} <ArrowRight size={14} />
        </Link>
      </div>

      <button 
        onClick={onRestart}
        className="flex items-center gap-2 mx-auto text-[10px] uppercase tracking-widest text-ngt-white/30 hover:text-ngt-gold transition-colors"
      >
        <RefreshCcw size={12} /> Recommencer le test
      </button>
    </motion.div>
  );
}
