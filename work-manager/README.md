# Work Manager

A tool for creating, managing, and automating work.

## Features (Planned)

- Workflow creation and editing
- Process automation
- Integration capabilities
- Trigger-based actions
- Approval flows
- Visual workflow designer
- Reporting and analytics

## Backend Architecture

The backend is built with Node.js and Express, using MongoDB for data storage. It is organized around the following domains:

- **Prompts**: Text templates sent to LLMs as part of jobs, agents, and workflows
- **Agents**: Subject matter experts with specialized capabilities
- **Workflows**: The orchestration of jobs and processes
- **Jobs**: Units of work that reference available code in the form of local code or tools
- **Tools**: Executable components available locally or through remote procedure calls

### Agent Collaboration System

The backend includes a specialized agent collaboration system that allows multiple AI agents to work together on tasks. The current implementation focuses on a product discovery workflow with three specialized agents:

- **Product Manager Agent**: Leads the requirements gathering process, interacting directly with customers
- **Technical Leader Agent**: Provides technical guidance and ensures that technical details are collected
- **Designer Agent**: Ensures that design considerations are properly addressed during requirements gathering

This collaborative approach enables a more comprehensive gathering of requirements by addressing product, technical, and design considerations simultaneously.

## Development

### Prerequisites

- Node.js 14+
- MongoDB
- Docker and Docker Compose (for containerized setup)

### Setting Up the Backend

#### Option 1: Local Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/work-manager
   NODE_ENV=development
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The API will be available at http://localhost:5000.

#### Option 2: Docker Setup

1. Make sure Docker and Docker Compose are installed on your system

2. Build and start the containers:
   ```
   docker-compose up -d
   ```

3. To stop the containers:
   ```
   docker-compose down
   ```

The API will be available at http://localhost:5000, and MongoDB will be available at localhost:27017.

## API Endpoints

- `/api/prompts` - CRUD operations for prompts
- `/api/agents` - CRUD operations for agents
- `/api/workflows` - CRUD operations for workflows
- `/api/jobs` - CRUD operations for jobs
- `/api/tools` - CRUD operations for tools
- `/api/collaborations` - Operations for agent collaborations:
  - `/api/collaborations/conversations` - Start a new agent conversation
  - `/api/collaborations/workflows/product-discovery` - Create a new product discovery workflow

This project is currently in active development. More information will be added as development progresses. 