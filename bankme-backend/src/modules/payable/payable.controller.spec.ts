import { Test, TestingModule } from '@nestjs/testing';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import {
  createPayable,
  payables as mockedPayables,
} from '../../helpers/faker/payable';
import { CreatePayableDto } from './dto/create-payable.dto';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateUuid } from '../../helpers/faker/uuid';
import { AssignorNotFoundException } from '../assignor/exceptions/assignor-not-found.exception';

describe('PayableController', () => {
  let controller: PayableController;
  let prisma: PrismaService;
  let service: PayableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayableController],
      providers: [PrismaService, PayableService],
    }).compile();

    controller = module.get<PayableController>(PayableController);
    service = module.get<PayableService>(PayableService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    // prevents error from multiple instances of prisma at the same time
    await prisma.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create payable', () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreatePayableDto,
    };

    it('should return validation error messages if data is not valid', async () => {
      const wrongPayable = {
        value: 'not valid',
        emissionDate: 'not valid',
        assignorId: 'uuid not valid',
      };

      await target.transform(wrongPayable, metadata).catch((err) => {
        expect(err.getResponse().message).toEqual([
          'value must be a number conforming to the specified constraints',
          'emissionDate must be a valid ISO 8601 date string',
          'assignorId must be a UUID',
        ]);
      });
    });

    it('should return validation error messages if data is empty', async () => {
      await target.transform(<CreatePayableDto>{}, metadata).catch((err) => {
        expect(err.getResponse().message).toEqual([
          'value must be a number conforming to the specified constraints',
          'value should not be empty',
          'emissionDate must be a valid ISO 8601 date string',
          'emissionDate should not be empty',
          'assignorId must be a UUID',
          'assignorId should not be empty',
        ]);
      });
    });

    it('should return payable data if data is valid', async () => {
      const assignorId = generateUuid();
      const rawMockPayable = createPayable();
      const mockPayable = {
        value: rawMockPayable.value,
        emissionDate: new Date(rawMockPayable.emissionDate),
        assignorId,
      };

      service.assignorExists = jest
        .fn()
        .mockImplementation(
          (assignorIdToSearch) => assignorIdToSearch === assignorId,
        );
      prisma.payable.create = jest.fn().mockReturnValue(mockPayable);

      const result = await controller.create(mockPayable);

      expect(service.assignorExists).toHaveBeenCalled();
      expect(prisma.payable.create).toHaveBeenCalledWith({
        data: {
          ...mockPayable,
          assignorId: undefined,
          assignor: { connect: { id: assignorId } },
        },
      });
      expect(result).toBe(mockPayable);
    });

    it('should not create payable and throw exception if assignorId does not exist', async () => {
      const wrongAssignorId = generateUuid();
      const rawMockPayable = createPayable();
      const mockPayable = {
        value: rawMockPayable.value,
        emissionDate: new Date(rawMockPayable.emissionDate),
        assignorId: wrongAssignorId,
      };

      service.assignorExists = jest
        .fn()
        .mockImplementation(
          (assignorIdToSearch) =>
            assignorIdToSearch === rawMockPayable.assignorId,
        );
      prisma.payable.create = jest.fn();

      await controller.create(mockPayable).catch((exception) => {
        expect(exception).toBeInstanceOf(AssignorNotFoundException);
      });

      expect(service.assignorExists).toHaveBeenCalledWith(wrongAssignorId);
      expect(prisma.payable.create).not.toHaveBeenCalled();
    });
  });

  describe('find all payables', () => {
    it('should return an array of payables', async () => {
      prisma.payable.findMany = jest.fn().mockReturnValue(mockedPayables);
      const result = await controller.findAll();

      expect(prisma.payable.findMany).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockedPayables);
    });
  });

  describe('find one payable', () => {
    it('should show one payable based on the id', async () => {
      const payableId = generateUuid();
      const mockPayable = { ...createPayable(), id: payableId };
      prisma.payable.findUnique = jest.fn().mockReturnValue(mockPayable);

      const result = await controller.findOne(payableId);

      expect(prisma.payable.findUnique).toHaveBeenCalledWith({
        where: { id: payableId },
      });
      expect(result).toBe(mockPayable);
    });
  });

  describe('update payable', () => {
    it('should update payable if all data is valid and new assignorId is passed', async () => {
      const assignorId = generateUuid();
      const payableId = generateUuid();
      const rawMockPayable = createPayable();
      const mockPayable = {
        id: payableId,
        value: rawMockPayable.value,
        emissionDate: new Date(rawMockPayable.emissionDate),
        assignorId,
      };

      service.assignorExists = jest
        .fn()
        .mockImplementation(
          (assignorIdToSearch) => assignorIdToSearch === assignorId,
        );
      prisma.payable.update = jest.fn().mockReturnValue(mockPayable);

      const result = await controller.update(payableId, mockPayable);

      expect(service.assignorExists).toHaveBeenCalledWith(assignorId);
      expect(prisma.payable.update).toHaveBeenCalledWith({
        where: { id: mockPayable.id },
        data: {
          value: mockPayable.value,
          emissionDate: mockPayable.emissionDate,
          assignor: { connect: { id: assignorId } },
        },
      });
      expect(result).toBe(mockPayable);
    });

    it('should update payable if all data is valid and new assignorId is not passed', async () => {
      const payableId = generateUuid();
      const rawMockPayable = createPayable();
      const mockPayable = {
        value: rawMockPayable.value,
        emissionDate: new Date(rawMockPayable.emissionDate),
      };

      service.assignorExists = jest.fn();
      prisma.payable.update = jest.fn().mockReturnValue(mockPayable);

      const result = await controller.update(payableId, mockPayable);

      expect(service.assignorExists).not.toHaveBeenCalled();
      expect(prisma.payable.update).toHaveBeenCalledWith({
        where: { id: payableId },
        data: mockPayable,
      });
      expect(result).toBe(mockPayable);
    });

    it('should not update payable and throw exception if new assignorId is not valid', async () => {
      const assignorId = generateUuid();
      const rawMockPayable = createPayable();
      const mockPayable = {
        value: rawMockPayable.value,
        emissionDate: new Date(rawMockPayable.emissionDate),
        assignorId: generateUuid(), // UUID that does not exist on assignor
      };

      service.assignorExists = jest
        .fn()
        .mockImplementation(
          (assignorIdToSearch) => assignorIdToSearch === assignorId,
        );
      prisma.payable.update = jest.fn();

      await controller
        .update(generateUuid(), mockPayable)
        .catch((exception) => {
          expect(exception).toBeInstanceOf(AssignorNotFoundException);
        });

      expect(service.assignorExists).toHaveBeenCalled();
      expect(service.assignorExists).toHaveReturnedWith(false);
      expect(prisma.payable.update).not.toHaveBeenCalled();
    });
  });

  describe('remove payable', () => {
    it('should delete payable', async () => {
      const mockPayable = { ...createPayable(), id: generateUuid() };
      prisma.payable.delete = jest.fn();

      prisma.payable.findUnique = jest.fn().mockReturnValue(mockPayable);

      await controller.remove(mockPayable.id);

      expect(prisma.payable.delete).toHaveBeenCalledWith({
        where: { id: mockPayable.id },
      });
    });
  });
});
