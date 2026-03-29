# LabLedger: Comprehensive Feature List

LabLedger is a process-centric project and experiment management system tailored for hardware and robotics engineering teams. Its primary goal is to ensure learning is captured through trials, failures, iterations, and empirical observations.

Below is a complete description of all modules and features currently integrated into LabLedger:

## 1. Hierarchical Data Architecture
LabLedger structures work to map directly onto real engineering environments naturally:
- **Teams**: The root organizational unit.
- **Subteams**: Specialized groups (e.g., Avionics, Propulsion) that aggregate related projects and personnel.
- **Projects**: High-level initiatives owned by a Subteam.
- **Modules**: Sub-components or specific physical assets within a project.
- **Experiments**: Scientific trials or construction efforts tied to a module.
- **Logs**: Distinct procedural steps and observations appended to an experiment.

## 2. Robust Role-Based Access Control (RBAC)
A strict, scalable permission system ensures security while enabling collaboration:
- **Admin**: Has full system authority. Can approve/reject/delete users, create/delete subteams, hard-delete projects, and assign subteam leads.
- **Subteam Lead**: A "contributor" role enhanced with a special `LEAD` designation. Leads a specific subset of projects and hardware teams.
- **Contributor**: Standard engineering role. Can create projects, modules, experiments, and append new experimental logs.
- **Viewer**: Read-only access. Can review experiments and projects, but cannot mutate data or append logs.

## 3. Dedicated Admin Dashboard
A control center restricted exclusively to administrators for system and user management:
- **Registration Queue**: Review, approve (as viewers or contributors), or reject new user sign-ups.
- **User Management**: Dynamically change user roles, reassign users to different subteams, or safely delete them with ownership fallback logic.
- **Subteam Orchestration**: Create subteams or safely delete them (requiring mandatory auditing and reasons).
- **Lead Assignment**: Explicitly map eligible active users to serve as the Lead for any given subteam. 

## 4. Immutable Experiment Logging
The core focus of LabLedger is securing scientific and experimental integrity:
- **Rich Logging**: Contributors log three distinct phases per entry: *Procedure*, *Observations*, and *Outcome*.
- **Immutability**: Once an experiment log is appended, the backend API explicitly blocks `PUT` or `DELETE` operations on it. It serves as a permanent, time-stamped record.
- **File Attachments**: Users can securely attach files (schematics, photos, or data readouts) directly to their experiment logs.

## 5. Dynamic & Contextual UI
- **Subteam Grouping**: The primary Dashboard automatically maps and groups projects visually under their parent subteams for easy navigation.
- **Context-Aware Forms**: UI elements (like log creation forms or project deletion buttons) are dynamically hidden or rendered based entirely on the authenticated user's runtime role and subteam status.

## 6. Security & Infrastructure
- **Authentication**: JWT (JSON Web Tokens) manages sessions, ensuring routes are strictly guarded.
- **Encryption**: `bcrypt` secures all user passwords.
- **Fallback Ownership**: If a user is deleted or demoted to a viewer, any subteam leadership responsibilities or critical assignments they hold silently and safely fall back to an active admin, preventing orphaned data. 
- **Containerized Delivery**: Ships with `docker-compose` out of the box for unified frontend (Vite/React) and backend (Express/PostgreSQL) deployments.
