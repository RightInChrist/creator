# Task Manager

A comprehensive task management application with a React Native frontend and Express.js backend.

## Features

- Task management with different task types (epic, story, task, sub-task, bug)
- Custom task type creation and management
- Task hierarchy (parent-child relationships)
- RESTful API for task operations
- Modern React Native UI
- PostgreSQL database for data persistence

## Tech Stack

### Frontend
- React Native with Expo
- React Navigation for routing
- Axios for API calls

### Backend
- Node.js with Express
- Sequelize ORM
- PostgreSQL database

### DevOps
- Docker and Docker Compose for containerization

## Project Structure

```
task-manager/
├── frontend/             # React Native frontend application
│   ├── src/              # Source code
│   │   ├── components/   # Reusable UI components
│   │   ├── screens/      # Application screens
│   │   └── services/     # API services
│   ├── App.js            # Main application component
│   ├── package.json      # Frontend dependencies
│   └── Dockerfile        # Frontend Docker configuration
│
├── backend/              # Express.js backend API
│   ├── src/              # Source code
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # API controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── index.js      # Entry point
│   ├── package.json      # Backend dependencies
│   └── Dockerfile        # Backend Docker configuration
│
└── docker-compose.yaml   # Docker Compose configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)

### Running with Docker

1. Clone the repository
2. Navigate to the project directory
3. Run Docker Compose:

```bash
docker-compose up
```

This will start all services (frontend, backend, and PostgreSQL).

- Frontend: http://localhost:19002 (Expo DevTools)
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

### Running Locally (Without Docker)

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=postgres
DB_PASSWORD=postgres
```

4. Start the backend server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npm start
```

4. Use the Expo Go app on your mobile device or an emulator to run the application.

## API Endpoints

### Task Types

- `GET /api/task-types` - Get all task types
- `GET /api/task-types/:id` - Get task type by ID
- `POST /api/task-types` - Create a new task type
- `PUT /api/task-types/:id` - Update a task type
- `DELETE /api/task-types/:id` - Delete a task type

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## License

MIT 