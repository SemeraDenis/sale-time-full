import { Request } from 'express';
import { JwtUserInfo } from '../model/jwt-user-info.model';
import { CommonUnauthorizedException } from '../errors/exceptions/common.unauthorized-exception';

export class JwtUserUtils {
  static setUserToRequest(req: Request, decoded: any){
    if (!decoded)
      return;

    let jwtUserInfo = new JwtUserInfo();
    jwtUserInfo.id = decoded.id;
    jwtUserInfo.fullName = decoded.fullName;

    req.user = jwtUserInfo;
  }

  static getUserInfo(req: Request) : JwtUserInfo {
    const currentUser = req.user as JwtUserInfo;
    if (!currentUser)
      throw new CommonUnauthorizedException('Invalid User');

    return currentUser;
  }
}