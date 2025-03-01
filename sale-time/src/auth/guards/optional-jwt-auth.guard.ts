import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            return await super.canActivate(context) as boolean;
        } catch (error) {
            // Если токен невалидный или отсутствует — просто пропускаем
            return true;
        }
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();

        req.user = user || undefined;
        return user ?? null;
    }
}
