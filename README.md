# Issue Tracker API

## Project Overview
Issue Tracker API is a **backend application** built with **Next.js, Prisma, and MySQL**.  
It allows users to create and manage issues, track their status, and assign them to other users for collaboration.

---

## Features
- **JWT Authentication** – Secure login and protected routes  
- **User Management** – Register, login, and manage users  
- **Issue Management** – Create, update, and delete issues  
- **Status Tracking** – Issues can be set as:
  - `open`
  - `in_progress`
  - `closed`  
- **Assignments** – Assign issues to other users  
- **Database** – MySQL with Prisma ORM  

---

## Implementation Details

**Backend:**
- Next.js API Routes for RESTful endpoints  
- Prisma ORM connected to MySQL database  
- Secure JWT authentication for protected routes  

**Database:**
- MySQL schema managed through Prisma  
- Models for `User` and `Issue` with relationships to track assignees  
