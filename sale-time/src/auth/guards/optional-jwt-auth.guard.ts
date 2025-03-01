import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../types/request-with-user';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            return await super.canActivate(context) as boolean;
        } catch (error) {
            // Если токен невалидный или отсутствует — просто пропускаем
            console.log('OptionalJwtAuthGuard - No valid token, continuing without user.');
            return true;
        }
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<RequestWithUser>();

        req.user = user || undefined;
        return user ?? null;
    }
}
