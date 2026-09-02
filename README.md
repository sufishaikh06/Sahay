# HealthBridge — SIH 26133

Healthcare Access & Coordination Platform for Smart India Hackathon 2026.

## Overview

HealthBridge is a connected healthcare coordination platform designed to improve healthcare accessibility and continuity for rural and underserved communities. It connects healthcare workers, doctors, facilities, diagnostics, pharmacy services, referrals, and follow-up into one coordinated workflow.

## Tech Stack

| Layer          | Technology                     |
|----------------|-------------------------------|
| Frontend       | Next.js, React, TypeScript    |
| Backend        | Node.js, Express, TypeScript  |
| Auth           | Clerk                         |
| Database       | MongoDB Atlas                 |
| Storage        | Supabase (files/realtime)     |
| i18n           | English, Hindi, Marathi       |

## Repository Structure

```text
sih-26133/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── packages/
│   ├── ui/           # Shared UI components
│   ├── types/        # Shared TypeScript types
│   ├── validation/   # Shared validation schemas
│   └── config/       # Shared configuration
├── docs/             # Project documentation
└── agents/           # Developer agent context
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 10.0.0
- MongoDB Atlas account
- Clerk account
- Supabase account (optional, for file storage)

### Installation

```bash
git clone <repository-url>
cd sih-26133
npm install
```

### Environment Setup

Copy the environment example file and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables are documented in `.env.example`.

### Development

```bash
# Start frontend
npm run dev:web

# Start backend
npm run dev:api

# Start both
npm run dev
```

### Build

```bash
npm run build
```

## Documentation

- [Project Context](docs/PROJECT_CONTEXT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Contract](docs/API_CONTRACT.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Development Rules](docs/DEVELOPMENT_RULES.md)

## Team

| Role       | Responsibility                           |
|------------|------------------------------------------|
| Foundation | Common auth, shell, i18n, architecture   |
| S1         | Assigned role workflows (TBD)            |
| S2         | Assigned role workflows (TBD)            |
| S3         | Assigned role workflows (TBD)            |

## License

Private — Smart India Hackathon 2026
