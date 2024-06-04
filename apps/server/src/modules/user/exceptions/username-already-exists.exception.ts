import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernameAlreadyExistsException extends HttpException {
  constructor() {
    super(['username already exists'], HttpStatus.BAD_REQUEST);
  }
}
