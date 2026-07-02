# Software Requirements Specification (SRS) for LabLedger

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to outline the Software Requirements Specification (SRS) for **LabLedger**. LabLedger is a process-centric project and experiment management system designed specifically for hardware and robotics engineering teams. Its primary goal is to provide a structured environment where learning is captured through trials, failures, iterations, and empirical observations.

### 1.2 Scope
LabLedger provides a secure, role-based platform emphasizing data immutability and hierarchical organization for complex engineering projects. The system tracks efforts from the top-level organizational unit down to individual laboratory procedures and observations, enabling strict versioning and auditing of scientific experimental records.

### 1.3 Intended Audience
This document is intended for:
- **Developers & Engineers:** To understand the architecture and features expected in the system.
- **Project Managers & Subteam Leads:** To map the development lifecycle and tracking methods.
- **System Administrators:** To understand security, access control, and user management flows.

---

## 2. Overall Description

### 2.1 Product Perspective
LabLedger follows a modern 3-tier architecture:
- **Frontend (Client):** Built using React and Vite, presenting a dynamic, context-aware user interface.
- **Backend (API):** Hosted on Node.js using Express, providing a robust suite of RESTful API routes guarded by strict authentication mechanisms.
- **Database:** A relational PostgreSQL database that guarantees data integrity, structured relationships, and referential constraints.
The entire application environment is containerized using `docker-compose` for straightforward deployment.

### 2.2 User Classes and Characteristics
LabLedger relies on a stringent Role-Based Access Control (RBAC) system:
1. **Admin:** Full system authority. Manages users (approve/reject/delete), creates/deletes subteams, manages system-wide projects, and assigns subteam leads.
2. **Subteam Lead:** Operates with 'Contributor' privileges but possesses a "LEAD" designation. Responsible for managing hardware teams within a given subteam.
3. **Contributor:** Standard engineering personnel. Authorized to create projects, modules, and experiments, and actively append logs.
4. **Viewer:** Read-only personnel. Endowed with reviewing capabilities but lacking data mutation rights.

### 2.3 Operating Environment
- **Server:** Node.js (v18+ recommended)
- **Database:** PostgreSQL (v14+)
- **Client Web Browser:** Any modern browser supporting JavaScript ES6+ (Chrome, Firefox, Safari, Edge).
- **Deployment:** Docker & Docker Compose.

---

## 3. System Features & Functional Requirements

### 3.1 Hierarchical Data Architecture
The system mirrors real-world engineering project organization.
- **REQ-01 (Teams):** The system shall define a root organizational unit (Teams).
- **REQ-02 (Subteams):** The system shall allow creation of Subteams (e.g., Avionics) acting as aggregators for personnel and projects.
- **REQ-03 (Projects):** Members shall be able to track parent projects nested under specific subteams.
- **REQ-04 (Modules):** The system shall trace sub-components (physical hardware assets) nested under projects.
- **REQ-05 (Experiments):** The system shall support linking scientific trials mapping directly to specific modules.
- **REQ-06 (Logs):** Users shall be able to append specific procedural updates directly to experiments.

### 3.2 Immutable Experiment Logging
A core philosophy in LabLedger is that an experiment, once documented, represents scientific truth at a given time point.
- **REQ-07 (Logging Stages):** Experiment logs must enforce three distinct phase entries: _Procedure_, _Observations_, and _Outcome_.
- **REQ-08 (Data Immutability):** The backend API shall explicitly block `PUT` or `DELETE` requests against appended experiment logs ensuring permanent, time-stamped auditing.
- **REQ-09 (File Attachments):** Users shall be able to attach technical data, schematics, and photos securely to log entries.

### 3.3 Enhanced Subteam & Administrative Controls
Administrators require extensive orchestration capabilities over the user base.
- **REQ-10 (Registration Queue):** The system shall maintain a queue where Admins review, approve, or reject user sign-up requests.
- **REQ-11 (Role Management):** Admins shall have the ability to re-allocate subteam assignments and modify system privileges programmatically.
- **REQ-12 (Leadership Designation):** The Admin Dashboard shall allow binding active, non-viewer users as designated `LEAD` for Subteams.
- **REQ-13 (Ownership Fallback Mechanism):** If a user is deleted or demoted to 'Viewer', the backend must immediately trigger automatic system fallback logic—reassigning their leadership mappings to an active Admin to prevent orphaned hardware/projects.
- **REQ-14 (Audited Deletion):** Deletion of major groups (like Subteams) must be formally audited requiring mandatory justified reasoning and constraint validation.

### 3.4 Dynamic & Context-Aware Interface
The client application must seamlessly adapt depending on user context.
- **REQ-15 (Automated Grouping):** Projects shown on the user dashboard must be visually clustered under their parent subteams automatically.
- **REQ-16 (Contextual Rendering):** Actionable components (buttons to 'Append Log', 'Delete Project') shall only render natively if the authenticated runtime state affirms proper authorization.

---

## 4. Non-Functional Requirements

### 4.1 Security and Privacy
- **SEC-01 (Authentication):** JSON Web Tokens (JWT) shall be used to assert validity on secured backend routes.
- **SEC-02 (Encryption):** All user credentials shall be strictly hashed and salted using industry-standard `bcrypt` prior to database execution.
- **SEC-03 (Endpoint Protection):** Middleware shall prevent any user attempting horizontal or vertical privilege escalation (e.g., a contributor hitting an admin-exclusive deletion endpoint).

### 4.2 Robustness and Integrity
- **REL-01 (Referential Integrity):** PostgreSQL schema design shall rely on robust Foreign Key cascades and constraints (preventing arbitrary user deletion when linked to active experiments).
- **REL-02 (Error Handling):** Form submissions shall have consistent backend data sanitization with informative API response payloads (e.g., Error 40X codes) delivered gracefully to the client layout.

### 4.3 Extensibility
- **EXT-01 (Modular API):** Routes for Subteams, Projects, Modules, Experiments, and Authentication shall be explicitly segregated under `backend/src/routes` ensuring scaleability for future hardware logging models.

---

## 5. System Models & Database Overview

While a complete physical database mapping is abstracted, the core relationships involve:
1. **Users Table:** Holds authentication data (email, bcrypt hash) and maps foreign roles/subteams.
2. **Subteams Table:** Primary sub-organization. Optionally referencing a specific user `lead_id`.
3. **Projects Table:** Maps uniquely to a Subteam ID.
4. **Modules & Experiments:** Cascades downward structurally from the Projects index.
5. **Logs Table:** Strictly immutable table mapped tracking experimental executions.

*(End of SRS)*
