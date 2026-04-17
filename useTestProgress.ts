import React from "react";
import { motion } from "framer-motion";
import { Question } from "../data/psychologyTestQuestions";

interface TestQuestionProps {
  question: Question;
  totalQuestions: number;
  currentIndex: number;
  onAnswer: (index: number) => void;
}

export default function TestQuestion({ question, totalQuestions, currentIndex, onAnswer }: TestQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-ngt-gold font-bold">
            {question.category}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-ngt-white/30">
            Question {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div className="h-1 w-full bg-ngt-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-ngt-gold"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-serif italic mb-10 leading-tight">
        {question.text}
      </h2>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className="w-full text-left p-6 border border-ngt-white/10 bg-ngt-white/[0.02] hover:border-ngt-gold/50 hover:bg-ngt-gold/5 transition-all group flex items-center gap-4"
          >
            <div className="w-8 h-8 rounded-full border border-ngt-white/20 flex items-center justify-center text-[10px] font-bold group-hover:border-ngt-gold group-hover:text-ngt-gold transition-colors">
              {String.fromCharCode(65 + index)}
            </div>
            <span className="text-sm md:text-base text-ngt-white/70 group-hover:text-ngt-white transition-colors">
              {option.text}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
