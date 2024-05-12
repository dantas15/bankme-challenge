import { Test, TestingModule } from '@nestjs/testing';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import {
  createPayable,
  payables as mockedPayables,
} from '../helpers/faker/payable';
import { CreatePayableDto } from './dto/create-payable.dto';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateUuid } from '../helpers/faker/uuid';
import { AssignorNotFoundException } from '../exceptions/assignor-not-found.exception';

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
    it('should show one payable based on the id', () => {});

    it('should return empty response if id does not exist', () => {});
  });

  describe('update payable', () => {
    it('should update payable if all data is valid', () => {});

    it('should update valid passed properties and leave the others as is', () => {});

    it('should not update payable if id is not valid', () => {});

    it('should not update payable if new assignorId is not valid', () => {});
  });

  describe('remove payable', () => {
    it('should delete payable if it has no payables pending', () => {});
  });
});
