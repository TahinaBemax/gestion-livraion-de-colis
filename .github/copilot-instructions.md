# Copilot Instructions for AI Agents

## Project Overview
This repository is a multi-component system for managing parcel deliveries, primarily built with NestJS (TypeScript) in the backend. Data is stored in PostgreSQL, with CSV and JSON files for initial data loads and testing. The backend is located in `backend/gestion-livraison-de-colis-api`.

## Architecture & Data Flow
- **Backend API**: Built with NestJS, organized by modules (see `src/modules/`). Each module represents a domain (e.g., `colis`, `livreur`, `planning-livraison`).
- **Common Utilities**: Shared DTOs, decorators, enums, exceptions, filters, guards, interceptors, middleware, pipes, and validators are in `src/common/`.
- **Data**: Initial and test data is in `database/data/` (CSV/JSON). SQL scripts for schema and seed data are in `database/script-sql/`.
- **Uploads**: User-uploaded files (CSV, images) are stored in `uploads/`.

## Developer Workflows
- **Install dependencies**: `npm install` in `backend/gestion-livraison-de-colis-api`
- **Run server**:
  - Development: `npm run start:dev`
  - Production: `npm run start:prod`
- **Testing**:
  - Unit: `npm run test`
  - E2E: `npm run test:e2e`
  - Coverage: `npm run test:cov`
- **Database setup**:
  - Configure `.env` with PostgreSQL credentials
  - Create tables using `database/script-sql/tables-used.sql`
  - Seed data with `constraintes.sql` and `default_data.sql`
- **API Documentation**: Available at `/docs` endpoint when server is running

## Project-Specific Conventions
- **Environment Variables**: All secrets and config (DB, JWT, CORS) are set in `.env` in the backend folder
- **JWT Auth**: Configure `JWT_SECRET` and `JWT_EXPIRES_IN` in `.env`
- **CORS**: Set `CLIENT_ORIGIN` in `.env` to match frontend domain
- **Module Structure**: Each domain logic is encapsulated in its own module under `src/modules/`
- **DTOs & Validation**: DTOs are in `src/common/dto/`, with custom decorators and validators for input transformation
- **Error Handling**: Custom exceptions and filters in `src/common/exceptions/` and `src/common/filters/`

## Integration Points
- **External**: PostgreSQL database, file uploads (CSV/images), JWT authentication
- **Internal**: Modules communicate via NestJS dependency injection and service boundaries

## Examples
- To add a new delivery domain, create a module in `src/modules/`, define DTOs in `src/common/dto/`, and update SQL/data files as needed
- For custom validation, add decorators in `src/common/decorators/` and validators in `src/common/validators/`

## Key Files & Directories
- `backend/gestion-livraison-de-colis-api/src/main.ts`: App entry point
- `backend/gestion-livraison-de-colis-api/src/app.module.ts`: Root module
- `backend/gestion-livraison-de-colis-api/src/modules/`: Domain modules
- `backend/gestion-livraison-de-colis-api/src/common/`: Shared logic
- `database/script-sql/`: SQL schema and seed scripts
- `.env`: Environment configuration

---

If any conventions or workflows are unclear or missing, please provide feedback to improve these instructions.
