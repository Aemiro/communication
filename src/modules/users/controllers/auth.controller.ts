import * as jwt from 'jsonwebtoken';

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordCommand, UserLoginCommand } from '../auth.commands';
import {
  AllowAnonymous,
  JwtAuthGuard,
  CurrentUserDto,
  CurrentUser,
} from '@libs/common';
import { AuthService } from '../auth.service';
import { Util } from '@libs/util';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @AllowAnonymous()
  async login(@Body() loginCommand: UserLoginCommand) {
    return this.authService.login(loginCommand);
  }
  @Get('get-user-info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@CurrentUser() user: CurrentUserDto) {
    return user;
  }
  @Post('refresh')
  @AllowAnonymous()
  async getRefreshToken(@Headers() headers: object) {
    if (!headers['x-refresh-token']) {
      throw new ForbiddenException(`Refresh token required`);
    }
    try {
      const refreshToken = headers['x-refresh-token'];
      const p = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
      ) as CurrentUserDto;
      return {
        accessToken: Util.GenerateToken(
          {
            id: p.id,
            email: p?.email,
            firstName: p?.firstName,
            gender: p?.gender,
            jobTitle: p?.jobTitle,
            phone: p?.phone,
            middleName: p?.middleName,
            lastName: p?.lastName,
            departmentId: p?.departmentId,
            profilePicture: p?.profilePicture,
            roles: p?.roles,
          },
          '60m',
        ),
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: CurrentUserDto,
    @Body() changePasswordCommand: ChangePasswordCommand,
  ) {
    changePasswordCommand.currentUser = user;
    return this.authService.changePassword(changePasswordCommand);
  }
}
