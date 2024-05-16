import { Test, TestingModule } from '@nestjs/testing';
import { AssignorController } from './assignor.controller';
import { AssignorService } from './assignor.service';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import {
  assignors as mockedAssignors,
  createAssignor,
  createAssignorWithEmptyPayables,
  createAssignorWithPayables,
} from '../../helpers/faker/assignor';
import { PrismaService } from '../prisma/prisma.service';
import { generateUuid } from '../../helpers/faker/uuid';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { AssignorHasPendingPayablesException } from '../../exceptions/assignor-has-pending-payables';
import { AssignorNotFoundException } from '../../exceptions/assignor-not-found.exception';

describe('AssignorController', () => {
  let controller: AssignorController;
  let prisma: PrismaService;

  const target: ValidationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignorController],
      providers: [PrismaService, AssignorService],
    }).compile();

    controller = module.get<AssignorController>(AssignorController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    // prevents error from multiple instances of prisma at the same time
    await prisma.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create assignor', () => {
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateAssignorDto,
    };

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

  describe('find one assignor', () => {
    it('should show one assignor based on the id', async () => {
      const assignorId = generateUuid();
      const assignor = { ...createAssignor(), id: assignorId };
      prisma.assignor.findUnique = jest.fn().mockReturnValue(assignor);

      const result = await controller.findOne(assignorId);

      expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
        where: { id: assignorId },
      });
      expect(result).toBe(assignor);
    });
  });

  describe('update assignor', () => {
    it('should update assignor if all data is valid', async () => {
      const assignorId = generateUuid();
      const updatedAssignor = {
        id: assignorId,
        document: '12345678901',
        email: 'modifiedMail@test.com',
        phone: '12345678900',
        name: 'modified name',
      };
      prisma.assignor.update = jest.fn().mockReturnValue(updatedAssignor);

      const result = await controller.update(assignorId, updatedAssignor);

      expect(prisma.assignor.update).toHaveBeenCalledWith({
        where: { id: assignorId },
        data: updatedAssignor,
      });
      expect(result).toBe(updatedAssignor);
    });

    it('should not update assignor if data is not valid', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: UpdateAssignorDto,
      };
      const assignorId = generateUuid();
      const updatedAssignor = {
        id: assignorId,
        document: '1'.repeat(31),
        phone: '1'.repeat(21),
        name: '1'.repeat(141),
      };
      prisma.assignor.update = jest.fn();

      await target
        .transform(<UpdateAssignorDto>updatedAssignor, metadata)
        .catch((err) => {
          expect(err.getResponse().message).toEqual([
            'document must be either 11 or 14 characters long',
            'phone must be shorter than or equal to 20 characters',
            'name must be shorter than or equal to 140 characters',
          ]);
        });
      expect(prisma.assignor.update).not.toHaveBeenCalled();
    });
  });

  describe('remove assignor', () => {
    it('should remove assignor if it has no payables pending', async () => {
      const assignorId = generateUuid();
      prisma.assignor.delete = jest.fn();

      prisma.assignor.findUnique = jest.fn().mockReturnValue({
        id: assignorId,
        ...createAssignorWithEmptyPayables(),
      });

      await controller.remove(assignorId);

      expect(prisma.assignor.delete).toHaveBeenCalledWith({
        where: { id: assignorId },
      });
    });

    it('should not remove assignor and throw exception if it has pending payables', async () => {
      const assignorId = generateUuid();
      prisma.assignor.delete = jest.fn();

      prisma.assignor.findUnique = jest.fn().mockReturnValue({
        id: assignorId,
        ...createAssignorWithPayables(),
      });

      await controller.remove(assignorId).catch((exception) => {
        expect(exception).toBeInstanceOf(AssignorHasPendingPayablesException);
      });

      expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
        where: { id: assignorId },
        include: { Payables: true },
      });
      expect(prisma.assignor.delete).not.toHaveBeenCalled();
    });

    it('should throw exception if assignor does not exist', async () => {
      const assignorId = generateUuid();
      prisma.assignor.delete = jest.fn();

      prisma.assignor.findUnique = jest.fn().mockReturnValue(null);

      await controller.remove(assignorId).catch((exception) => {
        expect(exception).toBeInstanceOf(AssignorNotFoundException);
      });

      expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
        where: { id: assignorId },
        include: { Payables: true },
      });
      expect(prisma.assignor.delete).not.toHaveBeenCalled();
    });
  });
});
