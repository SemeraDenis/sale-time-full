import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUserInfo } from '../model/jwt-user-info.model';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): JwtUserInfo => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as JwtUserInfo;
    },
);
