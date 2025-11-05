# Issue Tracker API

## Project Overview
Issue Tracker API is a **backend application** built with **Next.js, Prisma, and PostgreSQL (Neon)**.  
It allows users to create and manage issues, track their status, and assign them to other users for collaboration.

---

## Features
- **JWT Authentication** – Secure login with JWT tokens
- **User Management** – Register, login, logout, and list users
- **Issue Management** – Create, read, update, and delete issues
- **Status Tracking** – Issues can be set as:
  - `OPEN`
  - `IN_PROGRESS`
  - `CLOSED`
- **Assignments** – Assign issues to other users
- **Cloud Database** – PostgreSQL on NeonDB

---

## API Routes

### Authentication
- `POST /api/signup` - Register new user
- `POST /api/login` - Login and receive JWT token
- `POST /api/logout` - Logout user

### Users
- `GET /api/users` - Get all users (protected)

### Issues
- `GET /api/issues` - Get all issues with assignee details (protected)
- `POST /api/issues` - Create new issue (protected)
- `PATCH /api/issues/[id]` - Update issue (protected)
- `DELETE /api/issues/[id]` - Delete issue (protected)

---

## Implementation Details

**Backend:**
- Next.js API Routes for RESTful endpoints  
- Prisma ORM connected to PostgreSQL database (NeonDB)
- Secure JWT authentication for protected routes  

**Database:**
- Database schema managed through Prisma  
- Models for `User` and `Issue` with relationships to track assignees  
