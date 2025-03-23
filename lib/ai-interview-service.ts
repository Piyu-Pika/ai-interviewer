// AI Interview Service
import { toast } from "@/hooks/use-toast"

// Types for our API
export type InterviewQuestion = {
  id: string
  text: string
  category: "behavioral" | "technical" | "experience" | "scenario"
  difficulty: "easy" | "medium" | "hard"
  expectedDuration?: number
}

export type InterviewFeedback = {
  score: number // 0-100
  feedback: string
  strengths: string[]
  improvements: string[]
  keywords: {
    matched: string[]
    missed: string[]
  }
  sentiment: "positive" | "neutral" | "negative"
  confidence: number // 0-100
}

export type ResumeAnalysis = {
  skills: string[]
  experience: {
    years: number
    relevance: number // 0-100
  }
  strengths: string[]
  gaps: string[]
  suggestedQuestions: InterviewQuestion[]
}

// Configuration object
type AIServiceConfig = {
  apiKey?: string
  baseUrl?: string
  model?: string
}

// Default configuration 
const DEFAULT_CONFIG: AIServiceConfig = {
  model: "gpt-4"
}

// Helper function to make OpenAI API calls
async function callOpenAI(prompt: string, temperature: number = 0.7, maxTokens: number = 1000) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    
    if (!apiKey) {
      throw new Error("OpenAI API key not found")
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant helping with interview processes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature,
        max_tokens: maxTokens
      })
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('Error calling OpenAI:', error)
    throw error
  }
}

// AI interview service class
export class AIInterviewService {
  private config: AIServiceConfig
  
  constructor(config: AIServiceConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Generate interview questions based on job description and optionally resume
   */
  async generateQuestions(
    jobDescription: string, 
    resumeText?: string,
    count: number = 5
  ): Promise<InterviewQuestion[]> {
    try {
      const prompt = `
You are an expert in technical interview questions. Based on the following job description,
generate ${count} interview questions that would help assess a candidate's fit for the role.

JOB DESCRIPTION:
${jobDescription}

${resumeText ? `CANDIDATE RESUME: ${resumeText}` : ''}

The questions should be in the following types: technical, behavioral, situational.
For each question, specify the category and difficulty level (easy, medium, hard).

Provide your response in the following JSON format:
[
  {
    "id": "q1",
    "text": "Question here",
    "category": "technical|behavioral|situational|experience|cultural",
    "difficulty": "easy|medium|hard",
    "expectedDuration": 120
  }
]
`
      const result = await callOpenAI(prompt)
      
      // Parse the JSON response
      const questions = JSON.parse(result)
      
      // Add unique IDs to questions if they don't have them
      return questions.map((q: any, index: number) => ({
        ...q,
        id: q.id || `q${index + 1}`,
      }))
    } catch (error) {
      console.error('Error generating interview questions:', error)
      return []
    }
  }

  /**
   * Analyze a video interview response
   */
  async analyzeResponse(
    question: string, 
    responseTranscript: string
  ): Promise<InterviewFeedback> {
    try {
      const prompt = `
You are an expert in evaluating interview responses. Analyze the following candidate's answer to the given question.

QUESTION: ${question}

CANDIDATE'S ANSWER: ${responseTranscript}

Provide a comprehensive evaluation including:
1. A score from 0-100
2. Overall feedback (2-3 sentences)
3. 2-3 strengths
4. 2-3 areas for improvement
5. Key keywords/phrases that were effectively used
6. Important keywords/phrases that were missed

Provide your response in the following JSON format:
{
  "score": 85,
  "feedback": "Overall feedback here...",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Improvement 1", "Improvement 2"],
  "keywords": {
    "matched": ["keyword1", "keyword2", "keyword3"],
    "missed": ["missed1", "missed2"]
  }
}
`
      const result = await callOpenAI(prompt)

      // Parse the JSON response
      const feedback = JSON.parse(result)
      return feedback as InterviewFeedback
    } catch (error) {
      console.error('Error analyzing interview response:', error)
      throw new Error("Failed to analyze interview response")
    }
  }

  /**
   * Analyze a resume
   */
  async analyzeResume(resumeText: string, jobDescription: string): Promise<ResumeAnalysis> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Mock resume analysis
      return {
        skills: ["React", "NextJS", "TypeScript", "Tailwind CSS", "API Integration"],
        experience: {
          years: 3,
          relevance: 85
        },
        strengths: [
          "Strong frontend development skills",
          "Experience with modern React frameworks",
          "Good understanding of UI/UX principles"
        ],
        gaps: [
          "Limited backend experience",
          "No mention of testing frameworks",
          "Could benefit from more team leadership examples"
        ],
        suggestedQuestions: [
          {
            id: "rq1",
            text: "How do you approach testing in your React applications?",
            category: "technical",
            difficulty: "medium"
          },
          {
            id: "rq2",
            text: "Tell me about a time you had to learn a new technology quickly for a project.",
            category: "experience",
            difficulty: "medium"
          }
        ]
      }
    } catch (error) {
      console.error("Error analyzing resume:", error)
      throw new Error("Failed to analyze resume")
    }
  }
}

// Create and export a default instance
const aiInterviewService = new AIInterviewService()
export default aiInterviewService 

// Mock functions for development without API keys
export function mockGenerateInterviewQuestions(
  jobDescription: string,
  numQuestions: number = 5
): InterviewQuestion[] {
  // Create realistic dummy questions based on the job description
  const keywords = jobDescription
    .toLowerCase()
    .match(/\b(javascript|react|node|python|design|product|management|data|analytics|cloud|aws|azure|database|sql|nosql|leadership|communication)\b/g) || []
  
  const questions: InterviewQuestion[] = [
    {
      id: 'q1',
      text: `Tell me about your experience with ${keywords[0] || 'the technologies mentioned in the job description'}.`,
      category: 'experience',
      difficulty: 'medium',
      expectedDuration: 120,
    },
    {
      id: 'q2',
      text: `How would you approach a project that requires integrating ${keywords[1] || 'multiple systems'}?`,
      category: 'technical',
      difficulty: 'hard',
      expectedDuration: 180,
    },
    {
      id: 'q3',
      text: 'Tell me about a time when you had to learn a new technology quickly for a project.',
      category: 'behavioral',
      difficulty: 'medium',
      expectedDuration: 120,
    },
    {
      id: 'q4',
      text: 'How do you handle disagreements with team members about technical decisions?',
      category: 'behavioral',
      difficulty: 'medium',
      expectedDuration: 120,
    },
    {
      id: 'q5',
      text: 'What strategies do you use to ensure code quality and maintainability?',
      category: 'technical',
      difficulty: 'medium',
      expectedDuration: 150,
    }
  ]
  
  return questions.slice(0, numQuestions)
}

export function mockAnalyzeInterviewResponse(
  question: string,
  answer: string
): InterviewFeedback {
  // Check answer length to provide relevant mock feedback
  const wordCount = answer.split(/\s+/).length
  const isShortAnswer = wordCount < 20
  const isMediumAnswer = wordCount >= 20 && wordCount < 50
  const isLongAnswer = wordCount >= 50
  
  // Check for keywords in both question and answer to simulate matching
  const questionKeywords = question.toLowerCase().match(/\b(\w{4,})\b/g) || []
  const answerKeywords = answer.toLowerCase().match(/\b(\w{4,})\b/g) || []
  
  // Convert arrays to string arrays explicitly
  const qKeywords: string[] = Array.from(questionKeywords)
  const aKeywords: string[] = Array.from(answerKeywords)
  
  const matchedKeywords = qKeywords
    .filter(keyword => aKeywords.includes(keyword))
    .map(keyword => keyword.charAt(0).toUpperCase() + keyword.slice(1))
    .slice(0, 3)
  
  const missedKeywords = qKeywords
    .filter(keyword => !aKeywords.includes(keyword))
    .map(keyword => keyword.charAt(0).toUpperCase() + keyword.slice(1))
    .slice(0, 2)
  
  // Generate scores based on answer length
  const score = isShortAnswer ? 60 : isMediumAnswer ? 75 : 90
  
  return {
    score,
    feedback: isShortAnswer 
      ? "Your answer was brief and could benefit from more detail and examples."
      : isLongAnswer 
        ? "You provided a comprehensive answer with good details and examples."
        : "Your answer covered the basics but could use more specific examples.",
    strengths: [
      isLongAnswer ? "Thorough explanation of the topic" : "Clear and concise response",
      matchedKeywords.length > 0 ? `Good use of relevant terms like ${matchedKeywords.join(', ')}` : "Addressed the core question",
    ],
    improvements: [
      isShortAnswer ? "Provide more specific examples from your experience" : "Consider addressing potential challenges more explicitly",
      missedKeywords.length > 0 ? `Could have mentioned key concepts like ${missedKeywords.join(', ')}` : "Expand on how you would implement your approach",
    ],
    keywords: {
      matched: matchedKeywords.length > 0 ? matchedKeywords : ["Relevant", "Experience", "Skills"],
      missed: missedKeywords.length > 0 ? missedKeywords : ["Implementation", "Challenges"],
    },
    sentiment: isShortAnswer ? "neutral" : "positive",
    confidence: isShortAnswer ? 70 : isMediumAnswer ? 85 : 95,
  }
} 