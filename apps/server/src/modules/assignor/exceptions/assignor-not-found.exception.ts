import { HttpException, HttpStatus } from '@nestjs/common';

export class AssignorNotFoundException extends HttpException {
  constructor(assignorId?: string) {
    super(`Assignor not found with id: ${assignorId}`, HttpStatus.BAD_REQUEST);
  }
}
