# Cosmic Backend

A production‑ready Node.js/Express ecommerce backend using Prisma and MySQL.

## Project Structure
```
src/
├── controllers/   # Express route handlers
├── services/      # Business logic
├── repositories/  # Prisma client instance
├── routes/        # Route definitions
├── middleware/    # Express middleware (auth, error, logger)
├── validators/    # Zod schemas for request validation
├── prisma/        # Prisma schema & migrations
├── utils/         # Helpers (hashing, JWT, etc.)
├── config/        # Environment config helpers
├── app.js         # Express app config
└── server.js      # Server entry point
```

## Prerequisites
- Node.js 20.x
- MySQL 8
- pnpm / npm

## Setup
```bash
# 1. Clone repo
git clone <repo-url>
cd cosmic

# 2. Install dependencies
npm install

# 3. Create .env from example and fill credentials
cp .env.example .env
# Edit .env to match your database credentials

# 4. Run Prisma migrations
npx prisma migrate dev --name init

# 5. Start the server
npm run dev   # uses nodemon
# or
node src/server.js
```

## API Overview
All endpoints are prefixed with `/api`.

### Authentication
| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/register` | POST | Create a new user. |
| `/api/auth/login` | POST | Login and receive JWT. |
| `/api/auth/profile` | GET | Get authenticated user profile. |
| `/api/auth/profile` | PUT | Update authenticated user profile. |
| `/api/auth/change-password` | POST | Change password for authenticated user. |

All protected routes require the `Authorization: Bearer <token>` header.

## Example Requests

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
```

Successful response:
```json
{
  "success": true,
  "message": "Registered successfully",
  "data": {
    "token": "...jwt...",
    "user": {"id":1,"email":"john@example.com","firstName":"John","lastName":"Doe"}
  }
}
```

Use the `token` for subsequent authenticated requests.

## Response Format
All API responses follow a unified structure.

```json
// Success
{ "success": true, "message": "...", "data": {...} }

// Error
{ "success": false, "message": "...", "errors": [{"path":"email","message":"Invalid format"}] }
```

---

### Note on Future Modules
Address, Order, and Payment modules will be added following the same architecture and are currently under development.
