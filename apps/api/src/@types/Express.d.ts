declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      permissions: string[];
      roles: string[];
    }
  }
}

export {};
