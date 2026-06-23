import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recommendationService } from '../services/recommendations';
import type { GenerateRecommendationRequest, RecommendationStatus } from '@tolovelist/shared';

export function useRecommendations(profileId: string, categorySlug?: string) {
  return useQuery({
    queryKey: ['recommendations', profileId, categorySlug],
    queryFn: () => recommendationService.getByProfile(profileId, categorySlug),
    enabled: !!profileId,
  });
}

export function useGroupRecommendations(groupId: string, categorySlug?: string) {
  return useQuery({
    queryKey: ['groupRecommendations', groupId, categorySlug],
    queryFn: () => recommendationService.getByGroup(groupId, categorySlug),
    enabled: !!groupId,
  });
}

export function useGenerateRecommendations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateRecommendationRequest) =>
      recommendationService.generate(data),
    onSuccess: (_, variables) => {
      if (variables.groupId) {
        queryClient.invalidateQueries({
          queryKey: ['groupRecommendations', variables.groupId, variables.categorySlug],
        });
      } else {
        for (const pid of variables.profileIds) {
          queryClient.invalidateQueries({
            queryKey: ['recommendations', pid, variables.categorySlug],
          });
        }
      }
    },
  });
}

export function useUpdateRecommendationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RecommendationStatus }) =>
      recommendationService.updateStatus(id, status),
  });
}
