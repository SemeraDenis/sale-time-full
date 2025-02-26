import { SignUpRequestDto } from '../dto/sign-up.dto';
import { User } from '../entity/user.entity';
import { PasswordUtils } from '../utils/password.utils';

export class UserBuilder {
  public static async toEntity(dto: SignUpRequestDto): Promise<User> {
    const user = new User();

    user.login = dto.login;
    user.password = await PasswordUtils.hashPassword(dto.password);
    user.fullName = dto.fullName;
    user.email = dto.email;

    return user;
  }
}
