import { RequireAtLeastOne } from '@auth/shared-types';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      email: 'nathan.drake@naughtydog.com',
      password: '123456',
      permissions: ['users.list', 'users.create', 'metrics.list'],
      roles: ['administrator'],
      refresh_tokens: [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY0Mjc5NzgxMywiZXhwIjoxNjQzNDAyNjEzfQ.TlPCnn_xcS9rXJKfmvJI1gIPBzx_gXiC5Mw1ll-v_60',
      ],
    },
    {
      id: 2,
      email: 'ellie@naughtydog.com',
      password: '123456',
      permissions: ['users.list', 'metrics.list'],
      roles: ['editor'],
      refresh_tokens: [],
    },
  ];

  async findOne(
    filters: RequireAtLeastOne<Pick<User, 'id' | 'email'>>
  ): Promise<User | undefined> {
    const filterProperties = Object.keys(filters);

    if (!filterProperties.length) {
      return;
    }

    const user = this.users.find((user) =>
      filterProperties.every((property) => user[property] === filters[property])
    );

    return user;
  }

  async addRefreshToken(id: number, token: string): Promise<void> {
    const user = await this.findOne({ id });

    if (user) {
      user.refresh_tokens = [...user.refresh_tokens, token];
    }
  }

  async removeRefreshToken(id: number, token: string): Promise<void> {
    const user = await this.findOne({ id });

    if (user) {
      user.refresh_tokens = user.refresh_tokens.filter(
        (current) => current !== token
      );
    }
  }
}
