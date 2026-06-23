import { useQuery, useMutation } from '@tanstack/react-query';
import { questionService } from '../services/questions';

export function useQuestions(categorySlug: string) {
  return useQuery({
    queryKey: ['questions', categorySlug],
    queryFn: () => questionService.getByCategory(categorySlug),
    enabled: !!categorySlug,
  });
}

export function useQuestionProgress(profileId: string, categorySlug: string) {
  return useQuery({
    queryKey: ['questionProgress', profileId, categorySlug],
    queryFn: () => questionService.getProgress(profileId, categorySlug),
    enabled: !!profileId && !!categorySlug,
  });
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: ({
      profileId,
      questionId,
      value,
    }: {
      profileId: string;
      questionId: string;
      value: number;
    }) => questionService.submitAnswer(profileId, questionId, value),
  });
}
