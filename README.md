# Project Management System Backend

Basic MERN stack backend for a Project Management System.

## Features
- **Authentication**: JWT-based Login & Register.
- **Roles**: Admin and User roles.
- **Project Management**: Create, Read, Update, Delete projects (Admin). Update status (User).
- **File Upload**: Upload attachments using Multer.
- **Dashboard**: System analytics.
- **API Documentation**: Integrated Swagger UI.

## Tech Stack
- Node.js & Express
- MongoDB & Mongoose
- JWT (Authentication)
- Multer (File Upload)
- Swagger (Documentation)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Ensure `.env` file exists with:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/project-management
   JWT_SECRET=supersecretkey
   ```

3. **Run Server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

4. **API Documentation**
   Visit `http://localhost:5000/api-docs` to view Swagger UI.

## Usage

### Initial Setup
- You can register a user via `/api/auth/register`.
- By default, users are created with `User` role.
- To create an `Admin`, you can manually update the role in the database or use the registration endpoint if you modify it to accept role (current implementation accepts role in body).

### Endpoints
- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Projects**: `/api/projects` (CRUD)
- **Users**: `/api/users` (Admin management)
- **Dashboard**: `/api/dashboard`
