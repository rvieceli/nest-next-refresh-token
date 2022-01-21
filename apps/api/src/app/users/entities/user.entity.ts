export class User {
  id: number;
  email: string;
  password: string;
  permissions: string[];
  roles: string[];
  refresh_tokens: string[];
}
