import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt.utils';
import { JwtUserUtils } from '../utils/jwt-user.utils';

@Injectable()
export class JwtAuthenticationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyJWT(token);

        if (decoded) {
          JwtUserUtils.setUserToRequest(req, decoded);
        }
      }
    } catch (error) {
      console.error(`JWT Middleware Error: ${error.message}`);
    }

    next();
  }
}
