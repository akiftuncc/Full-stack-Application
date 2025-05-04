# Project Documentation

## Technologies

### Core

- Docker
- MySQL

### Backend

- TypeScript
- Nest.js
- JWT
- Passport
- Swagger
- Prisma
- bcrypt
- zod

### Frontend

- TypeScript
- Next.js
- react-query
- date-fns
- lucide
- recharts
- zustand
- shadcn

## Setup Instructions

### Option 1: Docker (Recommended)

```bash
docker compose up --build
```

### Option 2: Local Development

#### Prerequisites

- Node.js and yarn installed
- MySQL running locally

#### Step 1: Environment Setup

From the project root directory:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

#### Step 2: Backend Setup

```bash
cd backend
yarn
yarn prisma generate
yarn prisma migrate dev
yarn prisma:db:seed
yarn dev
```

#### Step 3: Frontend Setup

```bash
cd frontend
yarn
yarn dev
```

## Documentation

- API Documentation (http://localhost:8080/docs): [Swagger](http://localhost:8080/docs)
- Additional Info (http://localhost:3000/learn-more): [Application Insights](http://localhost:3000/learn-more)
