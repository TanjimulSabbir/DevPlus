<div align="center">

# 🚼 DevPulse

### Internal Tech Issue & Feature Tracker

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions — built with Node.js, TypeScript, Express, and PostgreSQL.

[![Node.js](https://img.shields.io/badge/Node.js-24.x_LTS-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Raw_SQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Database Schema](#-database-schema) · [Author](#-author)

</div>

---

## 📋 Overview

DevPulse is a RESTful API backend designed for software development teams. It enables team members to report bugs, submit feature requests, and track the resolution lifecycle of each issue — all secured behind a JWT-based authentication system with role-based access control.

---

## ✨ Features

- **JWT Authentication** — secure signup/login with token-based session management
- **Role-Based Access Control** — `contributor` and `maintainer` roles with distinct permission sets
- **Issue Lifecycle Management** — create, read, update, and delete issues with status tracking (`open` → `in_progress` → `resolved`)
- **Flexible Filtering & Sorting** — query issues by type, status, and creation date
- **No ORM, No JOINs** — all data access uses raw SQL with the native `pg` driver for full control and transparency
- **Secure by Design** — passwords are never returned in responses; JWT payload carries only what's needed

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 24.x LTS | Runtime environment |
| **TypeScript** | 5.x (latest stable) | Type-safe development |
| **Express.js** | 4.x | Modular HTTP framework |
| **PostgreSQL** | Any modern version | Relational database |
| **pg** | 8.x | Native PostgreSQL driver (raw SQL only) |
| **bcrypt** | 5.x | Password hashing (salt rounds: 10) |
| **jsonwebtoken** | 9.x | JWT generation & verification |
| **dotenv** | 16.x | Environment variable management |
| **http-status-codes** | 2.x | Consistent HTTP status code references |

---

## 👥 User Roles & Permissions

| Role | Permissions |
|---|---|
| `contributor` | Register & log in · Create issues · View all issues · Edit **own** issues (only when status is `open`) |
| `maintainer` | All contributor permissions · Update **any** issue (including status) · Delete any issue |

---

## 📁 Project Structure

```
devpulse/
├── src/
│   ├── config/
│   │   └── index.ts
│   ├── database/
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── data.validation.ts
│   │   ├── error.middleware.ts
│   │   └── role.middleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.body.schema.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   └── constant.ts
│   │   ├── issues/
│   │   │   ├── constant.ts
│   │   │   ├── issue.body.schema.ts
│   │   │   ├── issue.controller.ts
│   │   │   ├── issue.interface.ts
│   │   │   ├── issue.route.ts
│   │   │   └── issue.service.ts
│   │   └── user/
│   ├── types/
│   │   ├── express.d.ts
│   │   └── jwt.ts
│   ├── utils/
│   │   ├── app.error.ts
│   │   ├── asynce.handler.ts
│   │   ├── jwt.ts
│   │   └── sendResponse.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── readme.md
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) **v24 LTS** or higher
- [PostgreSQL](https://www.postgresql.org) running locally or remotely
- `npm` (bundled with Node.js)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/TanjimulSabbir/DevPlus.git
cd DevPlus
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/devpulse
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
```

**4. Initialise the database**

This creates the `users` and `issues` tables. Safe to re-run (uses `CREATE TABLE IF NOT EXISTS`).

```bash
npm run db:init
```

**5. Start the server**

```bash
# Development — hot reload via ts-node-dev
npm run dev

# Production — compile first, then run
npm run build
npm start
```

The API will be available at `http://localhost:3000`.

---

## 🌐 API Reference

### Base URL

```
http://localhost:3000/
```

### Authentication Header

All protected endpoints require a JWT in the `Authorization` header:

```
Authorization: <JWT_TOKEN>
```

---

### 🔐 Auth Module

#### Register a New User

```http
POST /api/auth/signup
```

**Request Body**

```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

> `role` is optional — defaults to `contributor`. Accepted values: `contributor`, `maintainer`.

**Response `201 Created`**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@devpulse.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

---

#### Login

```http
POST /api/auth/login
```

**Request Body**

```json
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@devpulse.com",
      "role": "contributor",
      "created_at": "2026-01-20T09:00:00Z",
      "updated_at": "2026-01-20T09:00:00Z"
    }
  }
}
```

---

### 📌 Issues Module

#### Create an Issue

```http
POST /api/issues
Authorization: <JWT_TOKEN>
```

**Request Body**

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

> `type` must be `bug` or `feature_request`. The `reporter_id` is automatically extracted from the JWT — never pass it in the body.

**Response `201 Created`**

```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

---

#### Get All Issues

```http
GET /api/issues
```

**Query Parameters**

| Parameter | Values | Default | Description |
|---|---|---|---|
| `sort` | `newest`, `oldest` | `newest` | Sort order by creation date |
| `type` | `bug`, `feature_request` | — | Filter by issue type |
| `status` | `open`, `in_progress`, `resolved` | — | Filter by workflow status |

**Example**

```
GET /api/issues?sort=oldest&type=bug&status=open
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": 45,
      "title": "Database connection timeout under load",
      "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-01-20T10:30:00Z",
      "updated_at": "2026-01-20T14:45:00Z"
    }
  ]
}
```

---

#### Get a Single Issue

```http
GET /api/issues/:id
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    },
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T14:45:00Z"
  }
}
```

---

#### Update an Issue

```http
PATCH /api/issues/:id
Authorization: <JWT_TOKEN>
```

**Access rules:**
- **Maintainer** — can update any issue, including changing `status`
- **Contributor** — can only update their own issues, and only when `status` is `open`; cannot change `status`

**Request Body** *(all fields optional)*

```json
{
  "title": "Updated: Database pool exhaustion fix needed",
  "description": "Updated description with reproduction steps and environment details...",
  "type": "bug",
  "status": "in_progress"
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "message": "Issue updated successfully",
  "data": {
    "id": 45,
    "title": "Updated: Database pool exhaustion fix needed",
    "description": "Updated description with reproduction steps and environment details...",
    "type": "bug",
    "status": "in_progress",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T14:45:00Z"
  }
}
```

---

#### Delete an Issue

```http
DELETE /api/issues/:id
Authorization: <JWT_TOKEN>
```

> **Maintainer only.** Permanently removes the issue from the system.

**Response `200 OK`**

```json
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

---

### 🚨 Error Response Format

All errors follow a consistent structure:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error message(s)"]
}
```

**HTTP Status Code Reference**

| Code | Reason | When it's used |
|---|---|---|
| `200` | OK | Successful GET, PATCH, DELETE |
| `201` | Created | Successful POST (resource created) |
| `400` | Bad Request | Validation errors, invalid input, duplicate email |
| `401` | Unauthorized | Missing, expired, or invalid JWT |
| `403` | Forbidden | Valid token but insufficient role/permissions |
| `404` | Not Found | Requested resource does not exist |
| `409` | Conflict | Business logic conflict (e.g. editing a non-open issue as contributor) |
| `500` | Internal Server Error | Unexpected server or database error |

---

## 🗄️ Database Schema

### `users`

```sql
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  role        VARCHAR(20)   NOT NULL DEFAULT 'contributor'
                CHECK (role IN ('contributor', 'maintainer')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```

### `issues`

```sql
CREATE TABLE issues (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(150)  NOT NULL,
  description  TEXT          NOT NULL,
  type         VARCHAR(20)   NOT NULL
                 CHECK (type IN ('bug', 'feature_request')),
  status       VARCHAR(20)   NOT NULL DEFAULT 'open'
                 CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id  INTEGER       NOT NULL,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```

> `reporter_id` intentionally has no foreign key constraint — referential integrity is enforced at the application layer.

---

## 🔐 Security Notes

- Passwords are **never** returned in any API response or logged to the console
- JWT payload contains only `id`, `name`, and `role` — the minimum needed to enforce permissions
- All SQL queries use **parameterised inputs** (`$1`, `$2`, …) to prevent SQL injection
- Salt rounds for bcrypt are set to **10** (within the required 8–12 range)

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with hot reload (`ts-node-dev`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled production build |
| `npm run db:init` | Create database tables (idempotent) |

---

## 👤 Author

**Tanjimul Islam Sabbir**

- GitHub: [@TanjimulSabbir](https://github.com/TanjimulSabbir)
- Email: [tanjimulsabbir.dev@gmail.com](mailto:tanjimulsabbir.dev@gmail.com)
- Repository: [github.com/TanjimulSabbir/DevPlus](https://github.com/TanjimulSabbir/DevPlus)

---

<div align="center">

Made with ❤️ by [Tanjimul Islam Sabbir](https://github.com/TanjimulSabbir)

</div>