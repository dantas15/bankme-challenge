import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ensureCorrectUserRole } from '../../helpers/ensureCorrectUserRole';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneByUsername(username: string) {
    const user = await this.prismaService.user.findFirst({
      where: { username },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      role: ensureCorrectUserRole(user.role),
    };
  }
}
