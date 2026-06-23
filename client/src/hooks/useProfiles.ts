import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profiles';
import { useProfileStore } from '../store/profileStore';
import type { CreateProfileRequest } from '@tolovelist/shared';

export function useProfiles() {
  const setProfiles = useProfileStore((s) => s.setProfiles);

  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const profiles = await profileService.list();
      setProfiles(profiles);
      return profiles;
    },
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProfileRequest) => profileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profileService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}
