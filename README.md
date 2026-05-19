# Golden Ray — Lead Management System

## What This App Does
This app is a mini CRM for a solar installation company called **Golden Ray Renewable Energy**.
It helps sales teams:
- Add new customer inquiries as leads.
- Track each lead through pipeline stages (`New Lead` to `Won` or `Lost`).
- Filter and search leads.
- Update lead details and status.
- View dashboard analytics like total leads and conversion rate.

## Project Structure
```text
.
├── client
│   ├── index.css
│   ├── tailwind.config.js
│   └── src
│       ├── api
│       │   └── leadsApi.ts
│       ├── components
│       │   ├── ConfirmDeleteModal.tsx
│       │   ├── FilterBar.tsx
│       │   ├── LeadTable.tsx
│       │   ├── Navbar.tsx
│       │   ├── StatusBadge.tsx
│       │   └── StatusUpdateModal.tsx
│       ├── pages
│       │   ├── AddLeadPage.tsx
│       │   ├── DashboardPage.tsx
│       │   ├── EditLeadPage.tsx
│       │   └── LeadsListPage.tsx
│       ├── types
│       │   └── lead.ts
│       ├── App.tsx
│       └── main.tsx
├── database
│   ├── schema.sql
│   └── seed.sql
├── server
│   ├── routes
│   │   ├── dashboard.py
│   │   └── leads.py
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   └── schemas.py
└── .env.example
```

## Prerequisites (What to install first)
- Node.js
- Python 3.10+
- Git

## Step 1: Set Up the Database
Run this from the project root folder.

```bash
python -c "import sqlite3; conn = sqlite3.connect('server/database/leads.db'); conn.executescript(open('database/schema.sql', 'r', encoding='utf-8').read()); conn.executescript(open('database/seed.sql', 'r', encoding='utf-8').read()); conn.commit(); conn.close()"
```
This command creates the SQLite database file, runs table creation SQL, and inserts sample leads.

## Step 2: Run the Backend
```bash
cd server
```
This command moves you into the backend folder.

```bash
pip install -r requirements.txt
```
This command installs all required Python packages for FastAPI and SQLite access.

```bash
uvicorn main:app --reload
```
This command starts the backend server on `http://localhost:8000` and auto-reloads on code changes.

## Step 3: Run the Frontend
Open a second terminal and run:

```bash
cd client
```
This command moves you into the frontend folder.

```bash
npm install
```
This command installs all frontend dependencies.

```bash
npm run dev
```
This command starts the React + Vite development server.

## Step 4: Open the App
- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs

## Environment Variables
Use `.env.example` as a reference file.

Current example values:
- `BACKEND_PORT=8000`
- `FRONTEND_PORT=5173`
- `DATABASE_URL=sqlite:///./database/leads.db`

## Screenshots
Add your screenshots inside the `screenshots/` folder after running the app.

Example:
- `screenshots/dashboard.png`
- `screenshots/leads-list.png`
- `screenshots/add-lead.png`
