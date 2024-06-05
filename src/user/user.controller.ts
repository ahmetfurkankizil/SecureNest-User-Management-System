import { Controller, Post, Get, Param, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';

/**
 * Controller responsible for handling user-related HTTP requests.
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Endpoint for user registration.
   * @param {Object} userData - User data containing username and email.
   * @param {string} userData.username - The username of the user.
   * @param {string} userData.email - The email of the user.
   * @returns {Promise<any>} Promise that resolves to the result of the registration.
   */
  @Post('register')
  async register(@Body() userData: { username: string, email: string }): Promise<any> {
    return await this.userService.register(userData.username, userData.email);
  }

  /**
   * Endpoint for verifying user's email.
   * @param {string} username - The username of the user.
   * @param {string} verificationToken - The verification token sent to the user's email.
   * @returns {Promise<any>} Promise that resolves to the result of the email verification.
   */
  @Get('verify-email/:username/:verificationToken')
  async verifyEmail(
    @Param('username') username: string,
    @Param('verificationToken') verificationToken: string,
  ): Promise<any> {
    return await this.userService.verifyEmail(username, verificationToken);
  }

  /**
   * Endpoint for checking user's email verification status.
   * @param {string} username - The username of the user.
   * @returns {Promise<any>} Promise that resolves to the verification status.
   */
  @Get('check-verification/:username')
  async checkVerification(@Param('username') username: string): Promise<any> {
    return await this.userService.checkVerification(username);
  }
}
