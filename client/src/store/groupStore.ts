import { create } from 'zustand';
import type { Group } from '@tolovelist/shared';

interface GroupState {
  groups: Group[];
  selectedGroupId: string | null;
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  selectGroup: (id: string) => void;
}

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  selectedGroupId: null,
  setGroups: (groups) => set({ groups }),
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
  selectGroup: (id) => set({ selectedGroupId: id }),
}));
