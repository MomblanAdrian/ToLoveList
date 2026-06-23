export interface Profile {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  relationshipType: 'single' | 'couple' | 'group';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileRequest {
  name: string;
  relationshipType: 'single' | 'couple' | 'group';
  avatarUrl?: string;
}
