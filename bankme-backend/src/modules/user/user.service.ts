import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ensureCorrectUserRole } from '../../helpers/ensureCorrectUserRole';
import { CreateUserDto } from './dto/create-user.dto';
import { UsernameAlreadyExistsException } from './exceptions/username-already-exists.exception';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ username, password }: CreateUserDto) {
    const userExists = await this.findOneByUsername(username);

    if (userExists) {
      throw new UsernameAlreadyExistsException();
    }

    const hashedPassword = await this.hashUserPassword(password);

    return await this.prismaService.user.create({
      data: { username, password: hashedPassword },
    });
  }

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

  async hashUserPassword(passwordBeforeHash: string) {
    return await hash(passwordBeforeHash, 10);
  }
}
