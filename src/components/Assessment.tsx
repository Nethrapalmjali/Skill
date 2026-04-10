import { useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  ClipboardCheck, 
  CheckCircle2, 
  ArrowRight, 
  Timer, 
  Brain,
  Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "What is the primary purpose of React's useEffect hook?",
    options: [
      "To manage local component state",
      "To perform side effects in functional components",
      "To create reusable UI components",
      "To handle form submissions"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "Which CSS property is used to create a flex container?",
    options: [
      "display: block",
      "display: grid",
      "display: flex",
      "display: inline"
    ],
    correct: 2
  },
  {
    id: 3,
    question: "What does the 'T' in TypeScript stand for?",
    options: [
      "Template",
      "Type",
      "Tool",
      "Technical"
    ],
    correct: 1
  }
];

export default function Assessment({ user, token, onUpdate }: { user: any, token: string, onUpdate: () => void }) {
  const [step, setStep] = useState("intro"); // intro, quiz, result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const startQuiz = () => {
    setStep("quiz");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: number[]) => {
    const score = finalAnswers.reduce((acc, curr, i) => {
      return acc + (curr === MOCK_QUESTIONS[i].correct ? 1 : 0);
    }, 0);

    const result = {
      type: "Frontend Development",
      score: (score / MOCK_QUESTIONS.length) * 100,
      date: new Date().toISOString()
    };

    try {
      const updatedAssessments = [...(user.assessments || []), result];
      await api.updateProfile(token, { assessments: updatedAssessments });
      setStep("result");
      onUpdate();
    } catch (error) {
      toast.error("Failed to save result");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="rounded-3xl border-slate-200 shadow-xl overflow-hidden">
              <div className="h-48 bg-indigo-600 flex items-center justify-center">
                <Brain className="w-24 h-24 text-white/20" />
              </div>
              <CardContent className="p-8 text-center">
                <Badge className="bg-indigo-50 text-indigo-700 border-none mb-4">Skill Check</Badge>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Frontend Development Assessment</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                  Evaluate your knowledge of React, CSS, and TypeScript. This assessment takes about 5 minutes.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <ClipboardCheck className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-900 uppercase">3 Questions</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <Timer className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-900 uppercase">5 Minutes</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <Trophy className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-900 uppercase">Certificate</p>
                  </div>
                </div>
                <Button onClick={startQuiz} className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold">
                  Start Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="rounded-3xl border-slate-200 shadow-xl">
              <CardHeader className="p-8 pb-0">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
                    Question {currentQuestion + 1} of {MOCK_QUESTIONS.length}
                  </span>
                  <div className="flex gap-1">
                    {MOCK_QUESTIONS.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 w-8 rounded-full transition-all ${
                          i <= currentQuestion ? "bg-indigo-600" : "bg-slate-100"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 leading-tight">
                  {MOCK_QUESTIONS[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <RadioGroup 
                  value={selectedOption?.toString()} 
                  onValueChange={(val) => setSelectedOption(parseInt(val))}
                  className="space-y-3"
                >
                  {MOCK_QUESTIONS[currentQuestion].options.map((option, i) => (
                    <div key={i} className="flex items-center">
                      <RadioGroupItem value={i.toString()} id={`option-${i}`} className="sr-only" />
                      <Label
                        htmlFor={`option-${i}`}
                        className={`flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          selectedOption === i 
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm" 
                            : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option}</span>
                          {selectedOption === i && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button 
                  onClick={handleNext} 
                  disabled={selectedOption === null}
                  className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold"
                >
                  {currentQuestion === MOCK_QUESTIONS.length - 1 ? "Finish Assessment" : "Next Question"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="rounded-3xl border-slate-200 shadow-xl p-8 text-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Assessment Complete!</h2>
              <p className="text-slate-500 mb-8">You've successfully completed the Frontend Development assessment.</p>
              
              <div className="bg-slate-50 rounded-3xl p-8 mb-8">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Your Score</p>
                <p className="text-6xl font-black text-indigo-600">
                  {Math.round(user.assessments?.[user.assessments.length - 1]?.score || 0)}%
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={() => setStep("intro")} className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold">
                  Back to Assessments
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()} className="w-full h-14 rounded-2xl border-slate-200 font-bold">
                  Go to Dashboard
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
