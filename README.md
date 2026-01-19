# LabLedger

## Project Overview
LabLedger is a process-centric project and experiment management system designed for hardware, robotics, and engineering teams. Unlike traditional code-focused tools, LabLedger captures experiments, procedures, failures, observations, and learnings as first-class entities.

The system is built to reflect how real engineering teams work — through trials, iterations, and evidence — rather than just final outcomes.

---

## Problem It Solves
Engineering teams frequently conduct experiments that do not result in immediate code or final deliverables. However:

- Experimental knowledge is scattered across notebooks, PDFs, chat messages, and personal memory
- Failures and intermediate learnings are rarely documented in a structured way
- Existing tools focus on code versioning, not experimental processes

As a result, valuable engineering knowledge is lost over time.

LabLedger solves this problem by acting as a **shared engineering memory**, preserving experiments, decisions, failures, and evidence in a structured and auditable manner.

---

## Target Users (Personas)

### Contributor (Engineer / Student)
- Conducts experiments
- Logs procedures, observations, parameters, and outcomes
- Uploads experimental evidence

### Project Lead
- Owns and manages projects
- Defines project-level roles and permissions
- Reviews experiments and controls access

### Reviewer / Mentor
- Faculty member or senior engineer
- Views experiment logs and outcomes
- Provides feedback without modifying data

---

## Vision Statement
To build a system that formalizes how engineering teams think, experiment, fail, and learn — ensuring that engineering knowledge is preserved, traceable, and reusable.

---

## Key Features / Goals
- Experiment-first workflow (not task or code-first)
- Append-only experiment logs to preserve history
- Role-based access control across teams and projects
- User-defined experimental parameters
- Cloud-based file attachments for evidence
- Clear ownership and visibility at team, subteam, and project levels

---

## Success Metrics
- Number of experiments and logs recorded per project
- Zero modification of logs after submission
- Correct enforcement of role-based permissions
- Clear traceability from experiment to outcome
- Successful end-to-end experiment logging workflow

---

## Assumptions & Constraints

### Assumptions
- Users belong to a single organization (team)
- Experiments are intentional and structured activities
- Users follow defined access roles

### Constraints
- Minimal UI for MVP
- Append-only logs (no editing or deletion)
- No machine learning features in MVP
- Focus on backend correctness and system design

---

## MoSCoW Prioritization

| Priority | Features |
|--------|---------|
| **Must Have** | Authentication, Projects, Experiments, Append-only Logs, RBAC |
| **Should Have** | File uploads, custom parameters |
| **Could Have** | Comments, data export |
| **Won’t Have** | Charts, analytics, machine learning |

---

## System Architecture (High-Level)
The system follows a layered architecture:

Frontend (React)
↓ HTTPS
Backend (Node.js + Express)
↓
Database (PostgreSQL)
↓
Cloud File Storage
↓
Containerized Deployment (Docker)


---

## Technology Stack

### Backend
- Node.js
- Express.js
- JWT-based authentication
- Role-Based Access Control (RBAC)

### Database
- Supabase (PostgreSQL)
- Relational database with JSON support for flexible, user-defined parameters

### Frontend
- React (minimal, role-aware UI)

### File Storage
- Cloud object storage (e.g., AWS S3 / Supabase Storage)

### Deployment
- Docker for local development
- Cloud hosting for backend and frontend

---

## Branching Strategy
This project follows **GitHub Flow**:

- `main` branch always contains stable code
- Feature development happens in separate feature branches
- Changes are merged back into `main` via pull requests

---

## Quick Start – Local Development

### Prerequisites
- Node.js
- Docker Desktop
- PostgreSQL
- Git

### Steps
1. Clone the repository
2. Configure environment variables
3. Run the application using Docker:
docker-compose up --build
4. Access the application via the local development URL
exposed by the frontend service.

---

## Local Development Tools
- Node.js
- Docker Desktop
- PostgreSQL
- GitHub
- VS Code

---

## Future Scope
- Advanced analytics on experimental data
- Machine learning–based experiment insights
- Exportable reports for academic and industry use
- Integration with external lab equipment and sensors

---

## Project Status
This repository currently contains the design, documentation, and planning artifacts required for Review 1. Implementation will proceed incrementally based on the approved architecture and workflow.
