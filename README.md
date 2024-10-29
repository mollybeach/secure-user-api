# Secure User API

A simple REST API for managing users securely with OAuth2 and JWT authentication.

## Features
- OAuth2 authentication with GitHub or Google
- JWT for session management
- Secure user registration and login endpoints
- PostgreSQL database with user data
- Input validation and protection against SQL injection

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- OAuth2, JWT
- Sequelize ORM

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Setup PostgreSQL database and update `.env` file
4. Run migrations: `npx sequelize db:migrate`
5. Start the API: `npm start`

## Endpoints
- `POST /register` - Register a new user
- `POST /login` - Login and get a JWT
- `GET /profile` - Get user profile (JWT required)

## File Structure

```
secure-user-api/
├── .env
├── .git/
├── .gitignore
├── README.md
├── config/
│   └── config.json
├── env.example
├── migrations/
├── models/
│   ├── User.js
│   └── index.js
├── node_modules/
├── package-lock.json
├── package.json
└── seeders/
```

