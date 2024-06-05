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

  private generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  private async saveUserData(username: string, email: string, verificationToken: string): Promise<User> {
    const user = this.userRepository.create({
      username,
      email,
      verificationToken,
      isVerified: false,
    });
    return await this.userRepository.save(user);
  }

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

  async checkVerification(username: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.isVerified ? 'User is verified' : 'User is not verified';
  }
}
