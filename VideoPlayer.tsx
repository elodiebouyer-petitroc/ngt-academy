import { useState, useEffect } from "react";

export function useTestProgress() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Intro, 1-N: Questions, N+1: Email, N+2: Result
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [email, setEmail] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ngt_psychology_test");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isCompleted) {
          // If completed, we might want to show results directly or allow restart
          // For now, let's just keep it in state
        }
      } catch (e) {
        console.error("Error parsing saved test progress", e);
      }
    }
  }, []);

  const saveProgress = (data: any) => {
    localStorage.setItem("ngt_psychology_test", JSON.stringify({
      ...data,
      updatedAt: new Date().toISOString()
    }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const handleAnswer = (questionId: number, optionIndex: number) => {
    const newAnswers = { ...answers, [questionId]: optionIndex };
    setAnswers(newAnswers);
    saveProgress({ answers: newAnswers, email, isCompleted });
    nextStep();
  };

  const completeTest = (userEmail: string) => {
    setEmail(userEmail);
    setIsCompleted(true);
    saveProgress({ answers, email: userEmail, isCompleted: true });
    nextStep();
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setEmail("");
    setIsCompleted(false);
    localStorage.removeItem("ngt_psychology_test");
  };

  return {
    currentStep,
    answers,
    email,
    isCompleted,
    handleAnswer,
    completeTest,
    nextStep,
    prevStep,
    restart
  };
}
