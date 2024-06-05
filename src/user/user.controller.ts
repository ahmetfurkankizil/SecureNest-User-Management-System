// user.controller.ts
import { Controller, Post, Get, Param, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userData: { username: string, email: string }) {
    return await this.userService.register(userData.username, userData.email);
  }

  @Get('verify-email/:username/:verificationToken')
  async verifyEmail(
    @Param('username') username: string,
    @Param('verificationToken') verificationToken: string,
  ) {
    return await this.userService.verifyEmail(username, verificationToken);
  }

  @Get('check-verification/:username')
  async checkVerification(@Param('username') username: string) {
    return await this.userService.checkVerification(username);
  }
}
