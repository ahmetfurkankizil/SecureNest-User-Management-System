# Beije User Registration and Verification API

This project implements a NestJS backend for user registration, email verification, and verification status checking.

## Project Structure

- **Framework**: Nest.js
- **Database**: SQLite
- **Email Service**: Using SMTP configuration for sending emails

### Modules

- **UserModule**
  - **UserController**: Handles the registration, email verification, and verification status checking endpoints.
  - **UserService**: Contains the business logic for registering users, verifying emails, and checking verification status.
  - **UserEntity**: Represents the User entity in the database.

### APIs

- **POST /user/register**
  - **POST parameters**: `{ username, email }`
  - **Action**: Registers a new user and sends a verification token to the provided email address.

- **GET /user/verify-email/{username}/{verificationToken}**
  - **GET parameters**: `{ username, verificationToken }`
  - **Action**: Verifies the user's email using the provided verification token.

- **GET /user/check-verification/{username}**
  - **GET parameters**: `{ username }`
  - **Action**: Checks if the user's email is verified.

### Setup and Usage

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd <repository_directory>
