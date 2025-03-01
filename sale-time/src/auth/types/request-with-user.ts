import { Request } from 'express';
import { JwtUserInfo } from '../../model/jwt-user-info.model';

export interface RequestWithUser extends Request {
    user?: JwtUserInfo;
}
