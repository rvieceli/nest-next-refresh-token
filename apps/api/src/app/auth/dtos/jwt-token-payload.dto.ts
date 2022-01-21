export class JwtTokenPayload {
  sub: number;
  email: string;
  roles: string[];
  permissions: string[];
}
