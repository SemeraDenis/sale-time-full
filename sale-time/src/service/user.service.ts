import { SignUpRequestDto } from '../dto/sign-up.dto';
import { SignInRequestDto } from '../dto/sign-in.dto';
import { User } from '../entity/user.entity';
import { ChangePasswordRequestDto } from '../dto/change-password.dto';

export interface UserService {
  signUp(dto: SignUpRequestDto): Promise<User>;
  signIn(dto: SignInRequestDto): Promise<User>;
  changePassword(dto: ChangePasswordRequestDto): Promise<void>;
}
