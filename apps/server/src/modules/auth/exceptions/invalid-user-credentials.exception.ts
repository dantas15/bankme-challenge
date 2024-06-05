import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUserCredentialsException extends HttpException {
  constructor() {
    super({ message: 'invalid username or password' }, HttpStatus.BAD_REQUEST);
  }
}
