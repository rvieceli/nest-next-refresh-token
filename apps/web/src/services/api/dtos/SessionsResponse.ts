import { User } from './User';

export interface SessionsResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
