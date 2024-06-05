**User Management System with Email Verification**

**Description**

This project is a Nest.js application designed to manage user registration and email verification functionalities. It utilizes a MySQL database for data storage and integrates with a mail server for sending verification emails. The application exposes RESTful API endpoints for user registration, email verification, and checking verification status.

**Setup Instructions**

Clone the Repository:

bash
Copy code
git clone https://github.com/your-repo/project.git
Install Dependencies:
Navigate to the project directory and run:

bash
Copy code
npm install
Database Configuration:
Make sure you have MySQL installed and running. Adjust the database connection settings in app.module.ts to match your MySQL configuration.

**Environment Configuration:**
Set the following environment variables in your own .env file:

MAIL_USER: Your email address for sending verification emails.
MAIL_PASS: Your email password or application-specific password.
MAIL_HOST: SMTP server hostname.
MAIL_PORT: SMTP server port (e.g., 465 for Gmail).
DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE: Database connection details.
Run the Application:

bash
Copy code
npm run start
Access the API:
The application will be running on http://localhost:3000. You can now access the API endpoints described below.

**Project Structure**

Controllers
UserController (user.controller.ts):
Endpoints:
POST /user/register: Registers a new user with a unique username and email.
GET /user/verify-email/:username/:verificationToken: Verifies a user's email using the provided verification token.
GET /user/check-verification/:username: Checks if a user's email is verified.

Services
UserService (user.service.ts):
Functionalities:
register(username: string, email: string): Registers a new user and sends a verification email.
verifyEmail(username: string, verificationToken: string): Verifies a user's email using the provided token.
checkVerification(username: string): Checks if a user's email is verified.

Entities
User (user.entity.ts):
Database entity representing a user with fields: id, username, email, verificationToken, and isVerified.

Modules
UserModule (user.module.ts):

Imports:
TypeOrmModule for database integration.
MailerModule for sending verification emails.
Providers: UserService
Controllers: UserController
AppModule (app.module.ts):

Imports:
TypeOrmModule for database configuration.
UserModule for user-related functionalities.
Providers: AppService
Controllers: AppController

API Endpoints

**POST /user/register**

Description: Registers a new user with a unique username and email.
Request Body: { "username": "string", "email": "string" }

**GET /user/verify-email/**

Description: Verifies a user's email using the provided verification token.
Path Parameters: username, verificationToken

**GET /user/check-verification/**

Description: Checks if a user's email is verified.
Path Parameter: username


**Contact Information**
For any inquiries or support, please contact furkan.kizil@ug.bilkent.edu.tr
