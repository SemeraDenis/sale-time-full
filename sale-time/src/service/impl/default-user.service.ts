import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user.service';
import { SignUpRequestDto } from '../../dto/sign-up.dto';
import { SignInRequestDto } from '../../dto/sign-in.dto';

import { User } from '../../entity/user.entity';
import { UserBuilder } from '../../mapper/user-builder';
import { CommonConflictException } from '../../errors/exceptions/common.conflict-exception';
import { PasswordUtils } from '../../utils/password.utils';
import { CommonUnauthorizedException } from '../../errors/exceptions/common.unauthorized-exception';
import { ChangePasswordRequestDto } from '../../dto/change-password.dto';
import { CommonBadRequestException } from '../../errors/exceptions/common.badrequest-exception';

@Injectable()
export class DefaultUserService implements UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getById(id: number): Promise<User|null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async signUp(dto: SignUpRequestDto): Promise<User> {
    const existUser = await this.usersRepository.findOne({
      where: { login: dto.login },
    });
    if (existUser) throw new CommonConflictException('User already exists');

    const user = await UserBuilder.toEntity(dto);
    return await this.usersRepository.save(user);
  }

  async signIn(dto: SignInRequestDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { login: dto.login },
    });

    if (!user || !(await PasswordUtils.comparePassword(dto.password, user.password)))
      throw new CommonUnauthorizedException('Invalid credentials');

    return user;
  }

  async changePassword(dto: ChangePasswordRequestDto): Promise<void> {
    if (dto.newPassword !== dto.confirmPassword)
      throw new CommonBadRequestException ('Passwords do not match');

    const user = await this.usersRepository.findOne({
      where: { login: dto.login },
    });

    if (!user || !(await PasswordUtils.comparePassword(dto.oldPassword, user.password)))
      throw new CommonUnauthorizedException ('Invalid credentials');

    user.password = await PasswordUtils.hashPassword(dto.newPassword);
    await this.usersRepository.save(user);
  }
}
