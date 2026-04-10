import { useState } from "react";
import { generateATSResume, analyzeResumeATS } from "@/src/lib/gemini";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Printer,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export default function ResumeBuilder({ user }: { user: any }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [resumeText, setResumeText] = useState("");
  const [targetJob, setTargetJob] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const resume = await generateATSResume(user);
      setGeneratedResume(resume);
      toast.success("Resume generated successfully!");
    } catch (error) {
      toast.error("Failed to generate resume");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText) {
      toast.error("Please paste your resume text first");
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzeResumeATS(resumeText, targetJob);
      setAnalysisResult(result);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI Resume Suite</h2>
        <p className="text-slate-500 mt-1">Build ATS-optimized resumes and analyze your existing ones.</p>
      </header>

      <Tabs defaultValue="builder" className="w-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-100 p-1 rounded-2xl mb-8">
          <TabsTrigger value="builder" className="rounded-xl data-active:bg-white data-active:shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Auto Builder
          </TabsTrigger>
          <TabsTrigger value="analyzer" className="rounded-xl data-active:bg-white data-active:shadow-sm">
            <Search className="w-4 h-4 mr-2" />
            ATS Analyzer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {!generatedResume ? (
            <Card className="rounded-3xl border-slate-200 shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Create your ATS-friendly resume</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Our AI will use your profile data to build a professionally formatted, 
                keyword-optimized resume that passes through ATS filters.
              </p>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate My Resume
                  </>
                )}
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="rounded-3xl border-slate-200 shadow-xl overflow-hidden bg-white print:shadow-none print:border-none">
                  <div className="p-12 space-y-8">
                    <header className="border-b border-slate-100 pb-8">
                      <h1 className="text-4xl font-bold text-slate-900">{user?.name}</h1>
                      <div className="flex flex-wrap gap-4 text-slate-500 mt-2 text-sm">
                        <span>{user?.email}</span>
                        <span>•</span>
                        <span>{user?.education}</span>
                      </div>
                    </header>

                    <section className="space-y-4">
                      <h2 className="text-lg font-bold text-indigo-600 uppercase tracking-wider">Professional Summary</h2>
                      <p className="text-slate-700 leading-relaxed">{generatedResume.summary}</p>
                    </section>

                    <section className="space-y-6">
                      <h2 className="text-lg font-bold text-indigo-600 uppercase tracking-wider">Experience</h2>
                      {generatedResume.experience.map((exp: any, i: number) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-slate-900">{exp.title}</h3>
                              <p className="text-slate-600">{exp.company}</p>
                            </div>
                            <span className="text-sm text-slate-400">{exp.period}</span>
                          </div>
                          <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-sm">
                            {exp.bullets.map((bullet: string, j: number) => (
                              <li key={j}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-lg font-bold text-indigo-600 uppercase tracking-wider">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {user?.skills?.map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-700 border-none rounded-lg px-3 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-lg font-bold text-indigo-600 uppercase tracking-wider">Education</h2>
                      <div className="space-y-2">
                        {generatedResume.education.map((edu: string, i: number) => (
                          <p key={i} className="text-slate-700">{edu}</p>
                        ))}
                      </div>
                    </section>
                  </div>
                </Card>
              </div>

              <div className="space-y-6 print:hidden">
                <Card className="rounded-3xl border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Resume Actions</h3>
                  <div className="space-y-3">
                    <Button onClick={handlePrint} className="w-full rounded-xl" variant="outline">
                      <Printer className="w-4 h-4 mr-2" />
                      Print / Save as PDF
                    </Button>
                    <Button onClick={handleGenerate} disabled={isGenerating} className="w-full rounded-xl" variant="ghost">
                      <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                      Regenerate
                    </Button>
                  </div>
                </Card>

                <Card className="rounded-3xl border-slate-200 shadow-sm p-6 bg-indigo-50 border-none">
                  <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Optimization
                  </h3>
                  <p className="text-sm text-indigo-700 leading-relaxed">
                    This resume has been optimized with industry-standard keywords 
                    and action-oriented bullet points to maximize your ATS score.
                  </p>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analyzer" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="rounded-3xl border-slate-200 shadow-sm p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Resume Content</CardTitle>
                  <CardDescription>Paste your current resume text below to analyze its ATS compatibility.</CardDescription>
                </CardHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-job">Target Job Title (Optional)</Label>
                    <Input 
                      id="target-job" 
                      placeholder="e.g. Senior Frontend Developer" 
                      value={targetJob}
                      onChange={(e) => setTargetJob(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resume-text">Resume Text</Label>
                    <textarea 
                      id="resume-text"
                      className="w-full h-64 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                      placeholder="Paste your resume here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing || !resumeText}
                    className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Analyze Resume
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            <div>
              <AnimatePresence mode="wait">
                {analysisResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <Card className="rounded-3xl border-slate-200 shadow-sm p-8 text-center bg-white">
                      <div className="relative inline-flex items-center justify-center mb-4">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-100"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364.4}
                            strokeDashoffset={364.4 - (364.4 * analysisResult.score) / 100}
                            className={`${
                              analysisResult.score >= 80 ? 'text-emerald-500' : 
                              analysisResult.score >= 60 ? 'text-amber-500' : 'text-red-500'
                            } transition-all duration-1000 ease-out`}
                          />
                        </svg>
                        <span className="absolute text-3xl font-black text-slate-900">{analysisResult.score}%</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">ATS Compatibility Score</h3>
                      <p className="text-slate-500 mt-2">{analysisResult.overallFeedback}</p>
                    </Card>

                    <Card className="rounded-3xl border-slate-200 shadow-sm p-6">
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        Missing Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.missingKeywords.map((keyword: string, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-amber-50 text-amber-700 border-none rounded-lg">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </Card>

                    <Card className="rounded-3xl border-slate-200 shadow-sm p-6">
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Improvement Tips
                      </h4>
                      <ul className="space-y-3">
                        {analysisResult.tips.map((tip: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                            <ChevronRight className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
                    <div className="text-center">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>Analysis results will appear here</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
