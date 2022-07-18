export interface NewUserData {
  firstName: string;
  lastName: string;
  license: boolean;
  emailAddress: string;
  password: string;
}

export interface UserOverviewData {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  license: boolean;
  blocked: boolean;
  admin: boolean;
}

export interface ToggleBlockedResponse {
  wasBlocked: boolean;
}
