import { JwtUserInfo } from '../../model/jwt-user-info.model';

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserInfo;  // Добавляем user как свойство Request
    }
  }
}