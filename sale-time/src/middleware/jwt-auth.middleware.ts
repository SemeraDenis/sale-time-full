import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt.utils';
import { JwtContainerUtils } from '../utils/jwtContainerUtils';
import { JwtUserUtils } from '../utils/jwt-user.utils';

@Injectable()
export class JwtAuthenticationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = JwtContainerUtils.getToken(req);
      const decoded = token ? verifyJWT(token) : null;
      if (decoded)
        JwtUserUtils.setUserToRequest(req, decoded)
    } catch (error) {
      console.error(error);
    }

    next();
  }
}