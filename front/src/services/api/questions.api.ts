import { API_CONFIG } from '@/config/api.config.ts';

import { BaseApi } from './base.api';

interface QuestionFilters {
  page?: number;
  limit?: number;
  title?: string;
  content?: string;
  hasCorrectAnswer?: boolean;
  minAnswers?: number;
  hasUserResponses?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateQuestionData {
  title: string;
  content: string;
  answers: Array<{
    content: string;
    isCorrect: boolean;
  }>;
}

export class QuestionsApi extends BaseApi {
  async getQuestions(filters: QuestionFilters = {}): Promise<never> {
    return this.get(API_CONFIG.ENDPOINTS.QUESTIONS.BASE, { params: filters });
  }

  async getQuestionById(id: number): Promise<never> {
    return this.get(API_CONFIG.ENDPOINTS.QUESTIONS.BY_ID(id));
  }

  async createQuestion(data: CreateQuestionData): Promise<never> {
    return this.post(API_CONFIG.ENDPOINTS.QUESTIONS.BASE, data);
  }

  async submitAnswer(questionId: number, answerId: number): Promise<never> {
    return this.post(`${API_CONFIG.ENDPOINTS.QUESTIONS.BY_ID(questionId)}/answers`, {
      answerId,
    });
  }
}

export const questionsApi = new QuestionsApi();
