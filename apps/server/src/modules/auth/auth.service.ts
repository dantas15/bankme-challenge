import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { UserService } from '../user/user.service';
import { InvalidUserCredentialsException } from './exceptions/invalid-user-credentials.exception';
import { JwtPayload } from '../../types/auth-jwt-payload.types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn({ login, password }: SignInDto) {
    const user = await this.userService.findOneByUsername(login);

    if (!user) {
      throw new InvalidUserCredentialsException();
    }

    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      // Throws the same as username for security reasons
      // https://stackoverflow.com/questions/14922130/which-error-message-is-better-when-users-entered-a-wrong-password
      throw new InvalidUserCredentialsException();
    }

    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
  }
}
