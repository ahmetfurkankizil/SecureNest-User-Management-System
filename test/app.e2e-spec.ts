import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { Repository } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  it('/user/register (POST)', async () => {
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
    };

    const response = await request(app.getHttpServer())
      .post('/user/register')
      .send(userData)
      .expect(201);

    expect(response.body.message).toBe('User registered successfully');

    const user = await userRepository.findOne({ where: { username: userData.username } });
    expect(user).not.toBeNull();
    if (user) {
      expect(user.email).toBe(userData.email);
      expect(user.isVerified).toBe(false);
      expect(user.verificationToken).toBeDefined();
    }
  });

  it('/user/verify-email/:username/:verificationToken (GET) - success', async () => {
    const username = 'testuser';
    const email = 'testuser@example.com';
    const verificationToken = 'testtoken';

    await userRepository.save({
      username,
      email,
      verificationToken,
      isVerified: false,
    });

    await request(app.getHttpServer())
      .get(`/user/verify-email/${username}/${verificationToken}`)
      .expect(200)
      .expect({ message: 'Email verified successfully' });

    const user = await userRepository.findOne({ where: { username } });
    expect(user).not.toBeNull();
    if (user) {
      expect(user.isVerified).toBe(true);
    }
  });

  it('/user/verify-email/:username/:verificationToken (GET) - user not found', async () => {
    await request(app.getHttpServer())
      .get('/user/verify-email/unknownuser/testtoken')
      .expect(404)
      .expect({ statusCode: 404, message: 'User not found' });
  });

  it('/user/verify-email/:username/:verificationToken (GET) - invalid token', async () => {
    const username = 'testuser';
    const email = 'testuser@example.com';
    const verificationToken = 'testtoken';

    await userRepository.save({
      username,
      email,
      verificationToken,
      isVerified: false,
    });

    await request(app.getHttpServer())
      .get(`/user/verify-email/${username}/invalidtoken`)
      .expect(400)
      .expect({ statusCode: 400, message: 'Invalid verification token' });
  });

  it('/user/check-verification/:username (GET) - user verified', async () => {
    const username = 'testuser';
    const email = 'testuser@example.com';

    await userRepository.save({
      username,
      email,
      verificationToken: 'testtoken',
      isVerified: true,
    });

    await request(app.getHttpServer())
      .get(`/user/check-verification/${username}`)
      .expect(200)
      .expect({ message: 'User is verified' });
  });

  it('/user/check-verification/:username (GET) - user not verified', async () => {
    const username = 'testuser';
    const email = 'testuser@example.com';

    await userRepository.save({
      username,
      email,
      verificationToken: 'testtoken',
      isVerified: false,
    });

    await request(app.getHttpServer())
      .get(`/user/check-verification/${username}`)
      .expect(200)
      .expect({ message: 'User is not verified' });
  });

  it('/user/check-verification/:username (GET) - user not found', async () => {
    await request(app.getHttpServer())
      .get('/user/check-verification/unknownuser')
      .expect(404)
      .expect({ statusCode: 404, message: 'User not found' });
  });
});