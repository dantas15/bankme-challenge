import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createUser, users as mockUsers } from '../../helpers/faker/user';
import { InvalidUserCredentialsException } from './exceptions/invalid-user-credentials.exception';
import { UserModule } from '../user/user.module';

const mockJwtSecret = 'jwt_secret';
jest.mock('../../config/auth.config', () => ({
  jwtConfig: {
    secret: 'jwt_secret', // it had to be hardcoded because there was a ReferenceError when using the const
  },
}));

describe('Auth', () => {
  let controller: AuthController;
  let service: AuthService;
  let prismaService: PrismaService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [PrismaService, UserService, AuthService],
    })
      .useMocker((token) => {
        if (token === UserModule) {
          return {
            findOneByUsername: jest.fn(),
          };
        }

        if (token === JwtService) {
          return new JwtService({
            global: true,
            secret: mockJwtSecret,
            signOptions: { expiresIn: '1m' },
          });
        }
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    await prismaService.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return validation error messages if data is missing', async () => {
      const target: ValidationPipe = new ValidationPipe({
        transform: true,
        whitelist: true,
      });
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: SignInDto,
      };
      service.signIn = jest.fn();

      await target.transform(<SignInDto>{}, metadata).catch((err) => {
        expect(err.getResponse().message).toEqual([
          'login must be a string',
          'login should not be empty',
          'password must be a string',
          'password should not be empty',
        ]);
      });

      expect(service.signIn).not.toHaveBeenCalled();
    });

    it('should throw InvalidUserCredentialsException if user with given username is not found', async () => {
      const userDataThatDoesNotExist = createUser();
      jest.spyOn(userService, 'findOneByUsername');

      await service
        .signIn({
          login: userDataThatDoesNotExist.username,
          password: userDataThatDoesNotExist.password,
        })
        .catch((exception) => {
          expect(exception).toBeInstanceOf(InvalidUserCredentialsException);
        });

      expect(userService.findOneByUsername).toHaveBeenCalledWith(
        userDataThatDoesNotExist.username,
      );
    });

    it('should throw InvalidUserCredentialsException if password is invalid', async () => {
      const userThatExists = mockUsers[0];
      const wrongPassword = 'wrong_password';

      userService.findOneByUsername = jest
        .fn()
        .mockImplementation(async (username: string) => {
          const result = mockUsers.find((u) => u.username === username);
          return !result ? null : result;
        });
      jest.spyOn(service, 'comparePassword');

      await service
        .signIn({
          login: userThatExists.username,
          password: wrongPassword,
        })
        .catch((exception) => {
          expect(exception).toBeInstanceOf(InvalidUserCredentialsException);
        });
      expect(userService.findOneByUsername).toHaveBeenCalledWith(
        userThatExists.username,
      );
      expect(service.comparePassword).toHaveBeenCalledWith(
        wrongPassword,
        userThatExists.password,
      );
    });

    it('should store the access token with correct payload if data is valid', async () => {
      const userThatExists = mockUsers[0];
      userService.findOneByUsername = jest
        .fn()
        .mockImplementation(async (username: string) => {
          const result = mockUsers.find((u) => u.username === username);
          return !result ? null : result;
        });

      const result = await service.signIn({
        login: userThatExists.username,
        password: userThatExists.unhashedPassword,
      });

      expect(result.access_token).toBeTruthy();
      expect(
        jwtService.verify(result.access_token, { secret: mockJwtSecret }),
      ).toMatchObject({
        userId: userThatExists.id,
        role: userThatExists.role,
        username: userThatExists.username,
      });
    });
  });
});
