// LangChain integration for AI Interviewer
import { toast } from "@/hooks/use-toast"
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'
import { InterviewQuestion, InterviewFeedback } from './mock-data'

// Types for our LangChain API
export type InterviewQuestion = {
  id: string
  text: string
  category: "behavioral" | "technical" | "experience" | "scenario"
  difficulty: "easy" | "medium" | "hard"
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
type LangChainConfig = {
  apiKey?: string
  baseUrl?: string
  model?: string
}

// Default configuration 
const DEFAULT_CONFIG: LangChainConfig = {
  baseUrl: "https://api.langchain.example",
  model: "gpt-4"
}

// Initialize the OpenAI model
// In a production app, you'd want to get this from environment variables
const model = new OpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'dummy-key',
  temperature: 0.7,
  modelName: 'gpt-3.5-turbo', // or 'gpt-4' for better results
  maxTokens: 1000,
})

// Prompt templates
const questionGenerationPrompt = PromptTemplate.fromTemplate(`
You are an expert in technical interview questions. Based on the following job description,
generate {numQuestions} interview questions that would help assess a candidate's fit for the role.

JOB DESCRIPTION:
{jobDescription}

The questions should be in the following types: technical, behavioral, situational.
For each question, specify the category and difficulty level (easy, medium, hard).

Provide your response in the following JSON format:
[
  {
    "id": "q1",
    "text": "Question here",
    "category": "technical|behavioral|situational|experience|cultural",
    "difficulty": "easy|medium|hard",
    "expectedDuration": 120 // in seconds
  }
]
`)

const responseAnalysisPrompt = PromptTemplate.fromTemplate(`
You are an expert in evaluating interview responses. Analyze the following candidate's answer to the given question.

QUESTION: {question}

CANDIDATE'S ANSWER: {answer}

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
`)

// Helper chains
const questionGenerationChain = new LLMChain({
  llm: model,
  prompt: questionGenerationPrompt,
})

const responseAnalysisChain = new LLMChain({
  llm: model,
  prompt: responseAnalysisPrompt,
})

// LangChain service class
export class LangChainService {
  private config: LangChainConfig
  
  constructor(config: LangChainConfig = {}) {
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
      const result = await questionGenerationChain.call({
        jobDescription,
        numQuestions: count,
      })

      // Parse the JSON response
      const questions = JSON.parse(result.text)
      
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
      const result = await responseAnalysisChain.call({
        question,
        answer: responseTranscript,
      })

      // Parse the JSON response
      const feedback = JSON.parse(result.text)
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
const langchainService = new LangChainService()
export default langchainService 

// Mock the LangChain calls for development without API keys
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
      text: 'Describe a challenging project you worked on and how you overcame obstacles.',
      category: 'behavioral',
      difficulty: 'medium',
      expectedDuration: 180,
    },
    {
      id: 'q3',
      text: `How do you stay updated with the latest trends in ${keywords[1] || 'your field'}?`,
      category: 'behavioral',
      difficulty: 'easy',
      expectedDuration: 120,
    },
    {
      id: 'q4',
      text: `Explain how you would design a system for ${jobDescription.includes('e-commerce') ? 'processing online orders' : 'managing user authentication'}.`,
      category: 'technical',
      difficulty: 'hard',
      expectedDuration: 240,
    },
    {
      id: 'q5',
      text: 'How would you handle a situation where team members disagree on implementation approaches?',
      category: 'situational',
      difficulty: 'medium',
      expectedDuration: 150,
    },
  ]

  return questions.slice(0, numQuestions)
}

export function mockAnalyzeInterviewResponse(
  question: string,
  answer: string
): InterviewFeedback {
  // Extract keywords from the question
  const questionKeywords = question
    .toLowerCase()
    .match(/\b(experience|project|challenge|design|system|situation|team|approach|trend|technical|problem|solution)\b/g) || []
  
  // Check if keywords from the question appear in the answer
  const matchedKeywords = questionKeywords.filter(keyword => 
    answer.toLowerCase().includes(keyword)
  )
  
  // Keywords that should have been mentioned based on the question
  const shouldHaveKeywords = [
    'experience', 'example', 'specific', 'details', 'results', 'learned', 'approach'
  ]
  
  const missedKeywords = shouldHaveKeywords.filter(keyword => 
    !answer.toLowerCase().includes(keyword)
  ).slice(0, 3)
  
  // Calculate a score based on answer length, keyword matches, and complexity
  const lengthScore = Math.min(answer.length / 20, 40) // Up to 40 points for length
  const keywordScore = matchedKeywords.length * 10 // 10 points per matched keyword
  const complexityScore = (answer.split('. ').length / 3) * 10 // Points for having multiple sentences
  
  let score = Math.min(Math.round(lengthScore + keywordScore + complexityScore), 100)
  
  // Ensure minimum score of 60 for answers that aren't empty
  if (answer.length > 50 && score < 60) {
    score = 60 + Math.floor(Math.random() * 10)
  }
  
  return {
    score,
    feedback: score >= 80 
      ? 'Excellent response that addresses the question thoroughly with specific examples and clear reasoning.' 
      : score >= 70 
        ? 'Good response overall, but could benefit from more specific examples and deeper exploration of the topic.' 
        : 'The response addresses the basic question but lacks depth and specificity. More concrete examples would strengthen the answer.',
    strengths: [
      'Provided a structured and logical response',
      answer.length > 200 ? 'Included sufficient detail in the explanation' : 'Answered concisely and to the point',
      matchedKeywords.length > 2 ? 'Addressed key aspects mentioned in the question' : 'Maintained focus on the question asked'
    ],
    improvements: [
      missedKeywords.length > 0 ? `Could have mentioned concepts like: ${missedKeywords.join(', ')}` : 'Could have expanded on the long-term impact',
      answer.split('. ').length < 5 ? 'Could benefit from more varied sentence structure and depth' : 'Could be more concise in certain sections',
      'Might include quantifiable results or metrics where applicable'
    ],
    keywords: {
      matched: matchedKeywords.length > 0 ? matchedKeywords : ['structured response'],
      missed: missedKeywords
    }
  }
} 