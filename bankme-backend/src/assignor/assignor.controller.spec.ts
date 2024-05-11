import { Test, TestingModule } from '@nestjs/testing';
import { AssignorController } from './assignor.controller';
import { AssignorService } from './assignor.service';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import {
  assignors as mockedAssignors,
  createAssignor,
} from '../helpers/faker/assignor';
import { PrismaService } from '../prisma/prisma.service';

describe('AssignorController', () => {
  let controller: AssignorController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignorController],
      providers: [PrismaService, AssignorService],
    }).compile();

    controller = module.get<AssignorController>(AssignorController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create assignor', () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateAssignorDto,
    };

    it('should return the assignor data if all information is right', async () => {
      const validAssignor = createAssignor();

      const result = await target
        .transform(validAssignor, metadata)
        .catch((e) => console.log(e));

      expect(result).toMatchObject(validAssignor);
    });

    it('should return validation error messages if data is not valid', async () => {
      const wrongAssignor = {
        document: Number('1'.repeat(10)),
        email: 'not valid',
        phone: 'not valid',
        name: 123,
      };

      await target.transform(wrongAssignor, metadata).catch((err) => {
        expect(err.getResponse().message).toEqual([
          'document must be either 11 or 14 characters long',
          'document must be a string',
          'email must be an email',
          'name must be shorter than or equal to 140 characters',
          'name must be a string',
        ]);
      });
    });

    it('should return validation error messages if data has more characters than specified', () => {});

    it('should return validation error messages if data is empty', async () => {
      await target.transform(<CreateAssignorDto>{}, metadata).catch((err) => {
        expect(err.getResponse().message).toEqual([
          'document must be either 11 or 14 characters long',
          'document must be a string',
          'document should not be empty',
          'email must be shorter than or equal to 140 characters',
          'email must be an email',
          'email should not be empty',
          'phone must be shorter than or equal to 20 characters',
          'phone should not be empty',
          'name must be shorter than or equal to 140 characters',
          'name must be a string',
          'name should not be empty',
        ]);
      });
    });

    it('should return assignor data if data is valid', async () => {
      const mockAssignor = createAssignor();
      prisma.assignor.create = jest.fn().mockReturnValue(mockAssignor);

      const result = await controller.create(mockAssignor);

      expect(prisma.assignor.create).toHaveBeenCalledWith({
        data: mockAssignor,
      });
      expect(result).toBe(mockAssignor);
    });
  });

  describe('find all assignors', () => {
    it('should return an array of assignors', async () => {
      prisma.assignor.findMany = jest.fn().mockReturnValue(mockedAssignors);
      const result = await controller.findAll();

      expect(prisma.assignor.findMany).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockedAssignors);
    });
  });
});
