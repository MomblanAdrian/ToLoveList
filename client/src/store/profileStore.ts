import { create } from 'zustand';
import type { Profile } from '@tolovelist/shared';

interface ProfileState {
  profiles: Profile[];
  selectedProfileId: string | null;
  setProfiles: (profiles: Profile[]) => void;
  addProfile: (profile: Profile) => void;
  removeProfile: (id: string) => void;
  selectProfile: (id: string) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profiles: [],
  selectedProfileId: null,
  setProfiles: (profiles) => set({ profiles }),
  addProfile: (profile) => set((state) => ({ profiles: [...state.profiles, profile] })),
  removeProfile: (id) =>
    set((state) => ({
      profiles: state.profiles.filter((p) => p.id !== id),
      selectedProfileId: state.selectedProfileId === id ? null : state.selectedProfileId,
    })),
  selectProfile: (id) => set({ selectedProfileId: id }),
}));
