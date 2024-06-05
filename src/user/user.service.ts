// user.service.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * Registers a new user.
   * @param {string} username - The username of the user.
   * @param {string} email - The email of the user.
   * @returns {Promise<string>} Promise that resolves to a success message.
   * @throws {BadRequestException} If the username or email already exists.
   */
  async register(username: string, email: string): Promise<string> {
    const userExists = await this.userRepository.findOne({ where: { username } });
    if (userExists) {
      throw new BadRequestException('Username already exists');
    }
    const emailExists = await this.userRepository.findOne({ where: { email } });
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    const verificationToken = this.generateVerificationToken();
    const user = await this.saveUserData(username, email, verificationToken);
    await this.sendVerificationEmail(email, verificationToken);
    return 'User registered successfully';
  }

  /**
   * Generates a random verification token.
   * @returns {string} The generated verification token.
   */
  private generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  /**
   * Saves user data to the database.
   * @param {string} username - The username of the user.
   * @param {string} email - The email of the user.
   * @param {string} verificationToken - The verification token.
   * @returns {Promise<User>} Promise that resolves to the saved user data.
   */
  private async saveUserData(username: string, email: string, verificationToken: string): Promise<User> {
    const user = this.userRepository.create({
      username,
      email,
      verificationToken,
      isVerified: false,
    });
    return await this.userRepository.save(user);
  }

  /**
   * Sends a verification email to the user.
   * @param {string} email - The email address of the user.
   * @param {string} verificationToken - The verification token.
   * @throws {BadRequestException} If sending the email fails.
   */
  private async sendVerificationEmail(email: string, verificationToken: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Email Verification',
        text: `Your verification token is: ${verificationToken}`,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new BadRequestException('Failed to send verification email');
    }
  }

  /**
   * Verifies the user's email.
   * @param {string} username - The username of the user.
   * @param {string} verificationToken - The verification token.
   * @returns {Promise<string>} Promise that resolves to a success message.
   * @throws {NotFoundException} If the user is not found.
   * @throws {BadRequestException} If the verification token is invalid.
   */
  async verifyEmail(username: string, verificationToken: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.verificationToken !== verificationToken) {
      throw new BadRequestException('Invalid verification token');
    }
    user.isVerified = true;
    await this.userRepository.save(user);
    return 'Email verified successfully';
}

/**
   * Checks the verification status of the user's email.
   * @param {string} username - The username of the user.
   * @returns {Promise<string>} Promise that resolves to the verification status message.
   * @throws {NotFoundException} If the user is not found.
   */
  async checkVerification(username: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.isVerified ? 'User is verified' : 'User is not verified';
  }
}
