export type Plan = "free" | "basic" | "premium";
export type Role = "owner" | "admin" | "member";

export type UserProfile = {
  id: UserId;
  name: string | null;
  image: string | null;
};

export type UserId = number;

export type UserSession = {
  id: UserId;
};

export type MemberInfo = {
  name: string | null;
  userId: UserId;
  image: string | null;
  role: Role;
};

export interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  email: string;
}

interface Email {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}
