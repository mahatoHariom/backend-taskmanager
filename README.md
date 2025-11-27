# Backend - Task Manager API

A Node.js/Express backend API for the Task Manager application with PostgreSQL database and Prisma ORM.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager?schema=public"
JWT_SECRET="normalsecreykey432545"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Environment Variables Explained

- `DATABASE_URL`: PostgreSQL connection string (replace `username`, `password`, and database name as needed)
- `JWT_SECRET`: Secret key for JWT token generation (use a strong random string in production)
- `PORT`: Port number for the backend server (default: 5000)
- `NODE_ENV`: Environment mode (`development` or `production`)
- `FRONTEND_URL`: Frontend application URL for CORS configuration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma Client:
```bash
npm run prisma:generate
```

3. Run database migrations:
```bash
npm run prisma:migrate
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:5000` with hot-reload enabled.

### Production Mode
```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks (with pagination, sorting, filtering)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Database Schema

The application uses PostgreSQL with Prisma ORM. Main models:
- **User**: User authentication and profile
- **Task**: Task management with title, description, status, priority, and due date
