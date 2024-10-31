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
- React (Frontend)

## PostgreSQL Setup

### 1. Check PostgreSQL Status
Check if PostgreSQL is running:
```bash
brew services list
```
If PostgreSQL is not running, you'll see "stopped" in the status column.

### 2. Start PostgreSQL
Start the PostgreSQL server:
```bash
brew services start postgresql
```

### 3. Verify PostgreSQL Status
Verify that PostgreSQL is running:
```bash
brew services list
```
You should see PostgreSQL listed as "started".

### 4. Connect to PostgreSQL
Connect to your PostgreSQL database:
```bash
psql -h localhost -U your_user_name
```

## Project Setup
1. Clone the repository
2. Install backend dependencies:
```bash
npm install
```
3. Setup PostgreSQL database and update `.env` file
4. Run migrations:
```bash
npx sequelize db:migrate
```

## Frontend Setup
1. Navigate to client directory:
```bash
cd client
```
2. Install frontend dependencies:
```bash
npm install
```
3. Start the frontend development server:
```bash
npm start
```

## Running the Application
1. Start the backend server:
```bash
# In the root directory
npm start
```
2. Start the frontend development server:
```bash
# In a new terminal, in the client directory
cd client
npm start
```
3. Visit `http://localhost:3001` in your browser

## API Endpoints
- `POST /register` - Register a new user
- `POST /login` - Login and get a JWT
- `GET /profile` - Get user profile (JWT required)
- `GET /users` - Get all users (JWT required)
- `PUT /users/:id` - Update user profile (JWT required)
- `DELETE /users/:id` - Delete user account (JWT required)

## File Structure
```
secure-user-api/
├── .git/
├── client/
│   ├── node_modules/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Profile.js
│   │   │   └── Register.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── Auth.css
│   │   │   ├── Login.css
│   │   │   ├── Profile.css
│   │   │   └── Register.css
│   │   ├── .DS_Store
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── .DS_Store
│   ├── .env
│   ├── .gitignore
│   ├── env.example
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── webpack.config.js
├── config/
│   ├── config.js
│   └── db.js
├── middleware/
│   ├── jwtAuth.js
│   └── oauthAuth.js
├── migrations/
│   ├── 20241029210158-create-users-table.js
│   ├── rename-timestamp-columns.js
│   └── YYYYMMDDHHMMSS-add-timestamps-to-users.js
├── models/
│   ├── index.js
│   └── User.js
├── node_modules/
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── seeders/
├── .DS_Store
├── .env
├── .gitignore
├── env.example
├── index.js
├── package-lock.json
├── package.json
└── README.md

```

## Environment Variables
Create a `.env` file in the root directory:
```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://localhost:5432/your_database_name
```

## Security Features
- JWT authentication
- Password hashing with bcrypt
- Input validation
- SQL injection protection
- CORS configuration
- Protected routes
- OAuth2 integration

## Development
- Run tests: `npm test`
- Run linter: `npm run lint`
- Build frontend: `cd client && npm run build`

## Testing Protected Routes

1. First, get a token by logging in:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

2. Use the token to access protected routes:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/users
```

3. Verify token validity:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/verify-token
```

### Common Issues:
1. "No token provided": Add Authorization header
2. "Token is invalid": Check token format and expiration
3. "Server error": Check server logs for details

### Using Postman:
1. Send POST request to /login
2. Copy token from response
3. For protected routes:
   - Add header: Authorization: Bearer YOUR_TOKEN

## Understanding OAuth & JWT

### OAuth (Open Authorization)
Think of it like a Valet Key for your car:
```javascript
// OAuth is like saying:
"Hey GitHub, this user wants to log into my app. 
Can you verify they are who they say they are?"

// Instead of:
"Hey user, create a new username/password just for my app"
```

**Real-world example:**
- When you click "Login with Google" instead of creating a new account
- Like using your hotel key card to access the gym (the hotel verifies you're a guest)

### JWT (JSON Web Token)
Think of it like a Wristband at a concert:
```javascript
// JWT is like:
"Here's your wristband (token) that proves you paid for the concert.
Show it whenever you want to:
- Get into the VIP area
- Buy drinks at the bar
- Access the backstage area"

// Instead of:
"Show your ID and ticket receipt every single time"
```

**Real-world example:**
```javascript
// 1. When you first log in, you get a token:
const token = "eyJhbGc.eyJzdWIi.4pcPyMD" // This is your wristband

// 2. For future requests, you just show your token:
fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### How They Work Together
```javascript
// 1. User clicks "Login with GitHub"
"Hey GitHub, is this person legit?"

// 2. GitHub says "Yes, here's their info"
{
  name: "user_name",
  email: "user_email",
  githubId: "user_github_id"
}

// 3. Your app gives them a JWT (wristband)
"Cool, here's your access token for our app"

// 4. User uses JWT for future requests
"Hi, I have this wristband, can I see my profile?"
```

### Simple Benefits:

**OAuth:**
- No new passwords to remember
- More secure (big companies handle security)
- Can easily revoke access

**JWT:**
- Like a VIP wristband
- Works everywhere in your app
- Can't be faked
- Contains user info

Think of it this way:
- OAuth is the bouncer checking your ID
- JWT is the wristband you get after being checked

   