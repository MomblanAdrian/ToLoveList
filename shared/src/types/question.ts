export interface Question {
  id: string;
  categoryId: string;
  text: string;
  order: number;
  createdAt: string;
}

export interface Answer {
  id: string;
  profileId: string;
  questionId: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitAnswerRequest {
  questionId: string;
  value: number;
}

export interface QuestionnaireProgress {
  categoryId: string;
  totalQuestions: number;
  answeredQuestions: number;
  isComplete: boolean;
}
