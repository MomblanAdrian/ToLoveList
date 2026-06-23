import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '../services/groups';
import { useGroupStore } from '../store/groupStore';
import type { CreateGroupRequest } from '@tolovelist/shared';

export function useGroups() {
  const setGroups = useGroupStore((s) => s.setGroups);

  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const groups = await groupService.list();
      setGroups(groups);
      return groups;
    },
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupRequest) => groupService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useAddProfileToGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, profileId }: { groupId: string; profileId: string }) =>
      groupService.addProfile(groupId, profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}
