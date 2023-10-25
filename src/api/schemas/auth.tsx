export interface UserPost {
  username: string;
  password: string;
}

export interface LoginPost {
  username: string;
  password: string;
  long_lived: boolean;
}

export interface UserSession {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
}

export enum UserAccountType {
  DEFAULT = "default",
  ADMIN = "admin",
}

export interface User {
  id: string;
  username: string;
  account_type: UserAccountType;
  enabled: boolean;
}
