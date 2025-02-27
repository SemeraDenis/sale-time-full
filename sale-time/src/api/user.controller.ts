import { Controller, Body, Req, Res, Get, Post, Inject, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { SignUpRequestDto } from '../dto/sign-up.dto';
import { SignInRequestDto } from '../dto/sign-in.dto';
import { JwtUserUtils } from '../utils/jwt-user.utils';
import { ChangePasswordRequestDto } from '../dto/change-password.dto';
import {signJWT} from "../utils/jwt.utils";
import {User} from "../entity/user.entity";

@Controller()
export class UserController {
  constructor(
    @Inject('UserService') private readonly userService: UserService,
  ) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiBody({
    description: 'Request body for user registration',
    type: SignUpRequestDto,
    examples: {
      example1: {
        summary: 'Valid request',
        value: {
          login: 'johndoe',
          password: 'securepassword',
          fullName: 'John Doe',
          email: 'johndoe@example.com',
        },
      },
    },
  })
  async signUp(@Body() request: SignUpRequestDto,
               @Res() res: Response): Promise<void> {
    const userEntity = await this.userService.signUp(request);
    this.sendAuthResponse(userEntity,res);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'User authorization' })
  @ApiResponse({ status: 200, description: 'User successfully authorized.' })
  @ApiBody({
    description: 'Request body for user authorization',
    type: SignInRequestDto,
    examples: {
      example1: {
        summary: 'Valid request',
        value: {
          login: 'john',
          password: 'securepassword',
        },
      },
    },
  })
  async signIn(
    @Body() request: SignInRequestDto,
    @Res() res: Response
    ): Promise<void> {
    const userEntity = await this.userService.signIn(request);
    this.sendAuthResponse(userEntity,res);
  }

  @Get('profile-info')
  @ApiOperation({ summary: 'Profile info' })
  @ApiResponse({ status: 200, description: 'Profile info.' })
  async profileInfo(@Req() request: Request): Promise<string> {
    return JwtUserUtils.getUserInfo(request).fullName;
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'User password successfully changed.' })
  @ApiBody({
    description: 'Request body for change password',
    type: ChangePasswordRequestDto,
    examples: {
      example1: {
        summary: 'Valid request',
        value: {
          login: 'john',
          oldPassword: 'securepassword',
          newPassword: 'newsecurepassword',
          confirmPassword: 'newsecurepassword',
        },
      },
    },
  })
  async changePassword(@Body() request: ChangePasswordRequestDto, @Res() res: Response): Promise<void> {
    await this.userService.changePassword(request);
    res.status(200).json({message: 'Change password successfully.'});
  }



  private sendAuthResponse(userEntity: User, res: Response): void {
    const jwtUser = { id: userEntity.id, fullName: userEntity.fullName };
    const token = signJWT(jwtUser);

    res
        .status(200)
        .json({ message: "User successfully authorized.", token: token });
  }
}
