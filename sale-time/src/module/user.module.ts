import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { DefaultUserService } from '../service/impl/default-user.service';
import { UserController } from '../api/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: 'UserService',
      useClass: DefaultUserService,
    },
  ],
  controllers: [UserController],
  exports: [TypeOrmModule, 'UserService'],
})
export class UsersModule {}