export interface GroupProfile {
  groupId: string;
  profileId: string;
  joinedAt: string;
  profile: {
    id: string;
    userId: string;
    name: string;
    avatarUrl: string | null;
    relationshipType: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Group {
  id: string;
  name: string;
  ownerId: string;
  profiles: GroupProfile[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  profileIds: string[];
}

export interface InviteToGroupRequest {
  groupId: string;
  profileId: string;
}
