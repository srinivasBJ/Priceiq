# PriceIQ

PriceIQ is a **smart price tracking platform** that helps users monitor product prices from e-commerce websites and track price changes over time.

The project is built with a **modern full-stack architecture** using:

- **Node.js + TypeScript** backend
- **PostgreSQL** database
- **Redis** caching
- **Docker** for infrastructure
- **Modern frontend framework** for UI

PriceIQ automatically collects and stores product pricing data so users can analyze price trends and identify the best time to buy.

---

# Features

- Track product prices from e-commerce websites
- Monitor price changes over time
- Store historical price data
- Fast data retrieval with Redis caching
- Full-stack architecture
- REST API backend
- Docker support for running infrastructure
- Modular and scalable project structure

---

# Tech Stack

## Backend
- Node.js
- TypeScript
- Express.js

## Frontend
- Modern JavaScript framework (Vite based)

## Database
- PostgreSQL

## Caching
- Redis

## Infrastructure
- Docker
- Docker Compose

---

# Project Structure

```
priceiq
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── services
│   │   ├── routes
│   │   └── index.ts
│
├── frontend
│   ├── src
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/srinivasBJ/Priceiq.git
cd priceiq
```

---

# Prerequisites

Make sure you have installed:

- Node.js (v18 or later)
- Docker
- Docker Compose
- npm

---

# Environment Setup

Create a `.env` file inside the backend folder.

Example configuration:

```
PORT=3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/priceiq

REDIS_HOST=localhost
REDIS_PORT=6379
```

---

# Quick Start (Local Development)

Run the project using **three terminals**.

---

# Terminal 1 – Start Database

Start PostgreSQL and Redis using Docker.

```bash
cd ~/Desktop/priceiq
docker compose up -d postgres redis
```

This will start:

- PostgreSQL
- Redis

---

# Terminal 2 – Start Backend

Run the backend API server.

```bash
cd ~/Desktop/priceiq/backend
npx ts-node src/index.ts
```

Backend will start on:

```
http://localhost:3000
```

---

# Terminal 3 – Start Frontend

Start the frontend development server.

```bash
cd ~/Desktop/priceiq/frontend
npm run dev
```

Frontend will start on:

```
http://localhost:5173
```

---

# Services Overview

| Service | Port | Description |
|------|------|------|
| Frontend | 5173 | Web interface |
| Backend | 3000 | API server |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache layer |

---

# API Endpoints

## Track a Product

```
POST /api/track
```

Example body:

```json
{
  "product_url": "https://example.com/product"
}
```

---

## Get Product Details

```
GET /api/product/:id
```

---

## Get Price History

```
GET /api/product/:id/history
```

---

# How PriceIQ Works

1. User submits a product URL
2. Backend fetches product price data
3. Price data is stored in PostgreSQL
4. Redis caches frequently accessed data
5. Historical prices are stored for analysis
6. Frontend displays price information and trends

---

# Roadmap

Planned improvements:

- Email price alerts
- Browser extension for tracking products
- Multi-website scraping support
- Price prediction using AI
- Authentication system
- Cloud deployment
- Dashboard analytics

---

# Deployment

PriceIQ can be deployed on:

- AWS
- Render
- Railway
- Fly.io
- Docker based servers

---

# Contributing

Contributions are welcome.

Steps:

1. Fork the repository
2. Create a new branch
3. Make changes
4. Submit a pull request

---

# License

MIT License

---

# Author

Srinivas

GitHub  
https://github.com/srinivasBJ
