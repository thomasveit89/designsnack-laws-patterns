import { Principle, QuizQuestion } from '../data/types';

// OpenAI API configuration
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface GeneratedQuizData {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    principleId: string;
  }>;
}

export async function generateQuizQuestions(principles: Principle[]): Promise<QuizQuestion[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set EXPO_PUBLIC_OPENAI_API_KEY in your environment.');
  }

  // Select 10 random principles for the quiz
  const selectedPrinciples = principles
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  const prompt = createQuizPrompt(selectedPrinciples);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert UX designer and educator who creates high-quality quiz questions about UX principles, cognitive biases, and design heuristics. Your questions should be clear, educational, and have plausible incorrect answers.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: OpenAIResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI API');
    }

    // Parse the JSON response
    let parsedData: GeneratedQuizData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Failed to parse quiz questions from AI response');
    }

    // Transform to our QuizQuestion format
    const quizQuestions: QuizQuestion[] = parsedData.questions.map((q, index) => ({
      id: `quiz_${Date.now()}_${index}`,
      principleId: q.principleId,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

    return quizQuestions;

  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw error;
  }
}

function createQuizPrompt(principles: Principle[]): string {
  const principleData = principles.map(p => ({
    id: p.id,
    title: p.title,
    type: p.type,
    oneLiner: p.oneLiner,
    definition: p.definition,
    category: p.category,
  }));

  return `Create exactly 10 multiple choice quiz questions based on these UX principles, cognitive biases, and heuristics. Each question should:

1. Test understanding of the principle/bias/heuristic
2. Have exactly 4 answer options (A, B, C, D)
3. Have only 1 correct answer
4. Include 3 plausible but incorrect options
5. Focus on practical understanding, not just definitions

Principles to use (create 1 question per principle):
${JSON.stringify(principleData, null, 2)}

Return your response as a JSON object with this exact structure:
{
  "questions": [
    {
      "question": "Clear, specific question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is correct (optional)",
      "principleId": "principle_id_from_above"
    }
  ]
}

Guidelines for question types:
- Definition questions: "What is [principle]?"
- Application questions: "When should you apply [principle]?"
- Scenario questions: "Which principle is demonstrated in this scenario?"
- Recognition questions: "This example shows which cognitive bias?"

Make sure the incorrect options are believable but clearly wrong to someone who understands the principle.`;
}

// Fallback quiz questions in case API fails
export function getFallbackQuizQuestions(principles: Principle[]): QuizQuestion[] {
  const selectedPrinciples = principles.slice(0, 10);
  
  return selectedPrinciples.map((principle, index) => ({
    id: `fallback_${principle.id}_${index}`,
    principleId: principle.id,
    question: `What is the main idea behind ${principle.title}?`,
    options: [
      principle.oneLiner,
      "Users prefer complex interfaces with many options",
      "Design should always prioritize aesthetics over functionality",
      "All users behave exactly the same way"
    ],
    correctAnswer: 0,
    explanation: `The correct answer is: "${principle.oneLiner}"`
  }));
}