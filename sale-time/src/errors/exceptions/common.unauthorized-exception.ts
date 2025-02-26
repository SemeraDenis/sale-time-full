import { HttpException, HttpStatus } from '@nestjs/common';

export class CommonUnauthorizedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
