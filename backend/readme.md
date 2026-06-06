# Advanced Task Manager API

A full-featured task management backend built with Node.js, Express, MongoDB, and Mongoose.  
It supports user authentication, project collaboration, lists, tasks, task ordering, and access control.

This project is designed as a RESTful backend for a team-based task management application.

---

## Features

- User registration and login with JWT authentication
- Create and manage projects
- Add and remove project members
- Transfer project ownership
- Create, update, reorder, and delete lists
- Create, update, move, reorder, and delete tasks
- Cascade deletion of tasks when a list is deleted
- Project-level access control and authorization
- Secure validation using Fastest Validator
- RESTful API structure

---

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Fastest Validator

---

## Project Structure

Typical project structure:

src/
├── controllers/
├── models/
├── routes/
├── validators/
├── middleware/
├── utils/
└── app.js

---

## Authentication

The API uses JWT Bearer Token authentication.

After registering or logging in, include the token in your requests:

Authorization: Bearer <token>

---

## Core Concepts

Users  
Users can register, log in, create projects, and collaborate on projects they are added to.

Projects  
Projects act as the main collaboration container.  
Each project can contain multiple lists and tasks and can have multiple members.

Lists  
Lists organize tasks within a project, similar to columns in a Kanban board.

Tasks  
Tasks belong to a list and can be reordered or moved between lists.

---

# API Documentation

## Base URL

/api

Example:

http://localhost:PORT/api

---

## Authentication

All project, list, and task routes require a Bearer Token.

Header:

Authorization: Bearer <token>

The token is returned after registration or login.

---

# Auth Endpoints

## Register User

POST /api/auth/signIn

Creates a new user and returns a JWT.

Request Body

{
  "username": "john",
  "email": "john@email.com",
  "password": "password123",
  "confirmPassword": "password123"
}

Response

{
  "message": "User registered successfully",
  "token": "JWT_TOKEN",
  "user": {
    "id": "userId",
    "username": "john",
    "email": "john@email.com"
  }
}

---

## Login

POST /api/auth/login

Authenticate a user.

Request Body

{
  "identifier": "john",
  "password": "password123"
}

identifier can be username or email.

Response

{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": "userId",
    "username": "john",
    "email": "john@email.com"
  }
}

---

# Projects

Base route:

/api/projects

Authentication required.

---

## Create Project

POST /api/projects

Request Body

{
  "name": "My Project",
  "description": "Project description",
  "members": ["alice", "bob"]
}

Members are usernames.

Response

{
  "success": true,
  "data": { ...project }
}

---

## Get User Projects

GET /api/projects

Returns projects where the user is a member.

Response

{
  "success": true,
  "data": [
    {
      "_id": "projectId",
      "name": "My Project",
      "description": "Project description",
      "owner": "ownerId"
    }
  ]
}

---

## Get Project By ID

GET /api/projects/:projectId

Returns the project dashboard with lists and tasks populated.

---

## Update Project

PATCH /api/projects/:projectId

Updates project information.

---

## Delete Project

DELETE /api/projects/:projectId

Deletes the project. Owner access required.

---

# Project Members

## Add Member

POST /api/projects/:projectId/members

Request Body

{
  "username": "alice"
}

Adds a user to the project.

---

## Remove Member

DELETE /api/projects/:projectId/members/:userId

Removes a member from the project.

---

## Transfer Ownership

PATCH /api/projects/:projectId/transfer

Request Body

{
  "newOwnerId": "userId"
}

Transfers project ownership.

---

# Lists

## Create List

POST /api/projects/:projectId/lists

Request Body

{
  "name": "To Do"
}

Creates a new list inside the project.

---

## Get Lists

GET /api/projects/:projectId/lists

Returns all lists within the project.

---

## Update or Reorder List

PATCH /api/projects/:projectId/lists/:listId

Updates list information or changes its order.

---

## Delete List

DELETE /api/projects/:projectId/lists/:listId

Deletes a list and cascades its tasks.

---

# Tasks

## Create Task

POST /api/projects/:projectId/lists/:listId/tasks

Request Body

{
  "title": "Design login screen",
  "description": "Create a clean login UI"
}

---

## Update, Move, or Reorder Task

PATCH /api/projects/:projectId/lists/:listId/tasks/:taskId

Used to update a task, move it between lists, or reorder its position.

---

## Delete Task

DELETE /api/projects/:projectId/lists/:listId/tasks/:taskId

Deletes a task.

---

# Authorization Rules

- Only authenticated users can access protected routes
- Only project members can access project resources
- Only the project owner can update or delete the project
- Only the owner can add members or transfer ownership
- Members may remove themselves from a project
- Project members can manage lists and tasks

---

# Data Integrity

The API maintains consistency through:

- Request validation using Fastest Validator
- Proper references between projects, lists, and tasks
- Automatic task positioning inside lists
- Reordering logic for lists and tasks
- Cascade deletion of tasks when lists are removed
- Username resolution to valid user IDs when adding project members

---

# Testing

The API can be tested using Postman.

Typical testing flow:

1. Register a user
2. Log in and obtain a JWT token
3. Create a project
4. Add members
5. Create lists
6. Create tasks
7. Reorder tasks and lists
8. Move tasks between lists
9. Delete lists and verify cascade deletion
10. Test authorization restrictions

---

# Status

The backend is feature-complete for the MVP and includes the core functionality required for a collaborative task management system.

---

# Possible Future Improvements

- Task assignment to users
- Due dates and reminders
- File attachments
- Comments and activity logs
- Notifications
- Real-time collaboration
- Frontend integration

