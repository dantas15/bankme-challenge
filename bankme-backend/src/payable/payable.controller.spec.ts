import { Test, TestingModule } from '@nestjs/testing';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { createPayable } from '../helpers/faker/payable';
import { CreatePayableDto } from './dto/create-payable.dto';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('PayableController', () => {
  let controller: PayableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayableController],
      providers: [PrismaService, PayableService],
    }).compile();

    controller = module.get<PayableController>(PayableController);
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

    it('should return the payable data if all information is right', async () => {
      const validPayable = createPayable();

      const result = await target.transform(validPayable, metadata);

      expect(result).toMatchObject(validPayable);
    });

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
  });
});
