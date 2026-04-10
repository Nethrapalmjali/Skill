import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getSkillRecommendations(userProfile: any) {
  const prompt = `Based on the following user profile, suggest 5 specific skills they should learn to improve their career prospects. 
  User Profile: ${JSON.stringify(userProfile)}
  Return the response as a JSON array of objects with 'skill' and 'reason' properties.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            skill: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["skill", "reason"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

export async function getJobMatches(userProfile: any, jobs: any[]) {
  const prompt = `Match the following user profile with the list of available jobs. 
  User Profile: ${JSON.stringify(userProfile)}
  Jobs: ${JSON.stringify(jobs)}
  Return a JSON array of objects with 'jobId' and 'matchScore' (0-100) and 'reason'.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            jobId: { type: Type.STRING },
            matchScore: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ["jobId", "matchScore", "reason"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

export async function getResumeSuggestions(userProfile: any) {
  const prompt = `Analyze this user profile and provide 3-5 specific suggestions to improve their resume and profile visibility.
  User Profile: ${JSON.stringify(userProfile)}
  Return a JSON array of strings.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}

export async function generateATSResume(userProfile: any) {
  const prompt = `Generate a professional, ATS-friendly resume based on the following user profile. 
  User Profile: ${JSON.stringify(userProfile)}
  Focus on using strong action verbs and quantifiable achievements.
  Return a JSON object with 'summary', 'experience' (array of objects with title, company, period, bullets), and 'education' (array).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                period: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "company", "period", "bullets"]
            }
          },
          education: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["summary", "experience", "education"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function analyzeResumeATS(resumeText: string, targetJob?: string) {
  const prompt = `Analyze the following resume text for ATS (Applicant Tracking System) compatibility. 
  ${targetJob ? `Target Job: ${targetJob}` : ""}
  Resume Text: ${resumeText}
  Provide a score (0-100), a list of missing keywords, and 3-5 specific tips for improvement.
  Return as a JSON object.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } },
          overallFeedback: { type: Type.STRING }
        },
        required: ["score", "missingKeywords", "tips", "overallFeedback"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
