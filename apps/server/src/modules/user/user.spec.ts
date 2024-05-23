import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { createUser } from '../../helpers/faker/user';
import { UsernameAlreadyExistsException } from './exceptions/username-already-exists.exception';

describe('User', () => {
  let controller: UserController;
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [PrismaService, UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create user', () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateUserDto,
    };

    it('should return validation error messages if data is not valid', async () => {
      const wrongUser = {
        username: Number('1'.repeat(141)),
        password: Number('1'.repeat(141)),
      };

      service.create = jest.fn();

      await target.transform(wrongUser, metadata).catch((err) => {
        expect(err.getResponse().message).toEqual([
          'username must be shorter than or equal to 140 characters',
          'username must be a string',
          'password must be shorter than or equal to 140 characters',
          'password must be a string',
        ]);
      });

      expect(service.create).not.toHaveBeenCalled();
    });

    it('should return validation error messages if data is missing', async () => {
      service.create = jest.fn();

      await target.transform(<CreateUserDto>{}, metadata).catch((err) => {
        expect(err.getResponse().message).toEqual([
          'username must be shorter than or equal to 140 characters',
          'username must be a string',
          'username should not be empty',
          'password must be shorter than or equal to 140 characters',
          'password must be a string',
          'password should not be empty',
        ]);
      });

      expect(service.create).not.toHaveBeenCalled();
    });

    it('should create user if all data is right', async () => {
      const mockUser = createUser();
      const mockUserWithHashPassword = {
        username: mockUser.username,
        password: await hash(mockUser.password, 10),
      };

      service.findOneByUsername = jest.fn().mockReturnValue(false);
      prismaService.user.create = jest.fn();
      service.hashUserPassword = jest
        .fn()
        .mockReturnValue(mockUserWithHashPassword.password);
      jest.spyOn(service, 'create');

      await controller.create(mockUser);

      expect(service.create).toHaveBeenCalledWith(mockUser);
      expect(service.findOneByUsername).toHaveBeenCalledWith(mockUser.username);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: mockUserWithHashPassword,
      });
    });

    it('should not create user if username already exists', async () => {
      const mockUser = createUser();

      service.findOneByUsername = jest.fn().mockReturnValue(true);
      jest.spyOn(prismaService.user, 'create');

      await controller.create(mockUser).catch((e) => {
        expect(e).toBeInstanceOf(UsernameAlreadyExistsException);
      });

      expect(service.findOneByUsername).toHaveBeenCalledWith(mockUser.username);
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('find user by username', () => {
    it('should call the find function based on the username passed', async () => {
      const mockUser = createUser();

      prismaService.user.findFirst = jest.fn().mockReturnValue(mockUser);

      const result = await service.findOneByUsername(mockUser.username);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { username: mockUser.username },
      });
      expect(result).toMatchObject(mockUser);
    });

    it('should return null if user with specified username dose not exist', async () => {
      const mockUser = createUser();

      prismaService.user.findFirst = jest.fn().mockReturnValue(null);

      const result = await service.findOneByUsername(mockUser.username);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { username: mockUser.username },
      });
      expect(result).toBe(null);
    });
  });
});
