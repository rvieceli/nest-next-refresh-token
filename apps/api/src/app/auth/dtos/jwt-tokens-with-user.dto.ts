export class JwtTokensWithUser {
  accessToken: string;
  refreshToken: string;
  user: Express.User;
}
