# GrooveTeach Backend API

FastAPI backend for **TeachClip / GrooveTeach** (web + mobile). Aligned with `PROJECT_DOCUMENTATION_BACKEND_HANDOFF.md`.

## Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app factory
│   ├── api/
│   │   ├── deps.py          # Auth + DB dependencies
│   │   └── v1/              # Versioned REST routes
│   ├── core/                # Config, security, constants
│   ├── db/                  # SQLAlchemy engine + sessions
│   ├── models/              # Database models
│   ├── schemas/             # Pydantic request/response models
│   └── services/            # Business logic (auth, etc.)
├── main.py                  # Dev entry: python main.py
├── requirements.txt
└── .env.example
```

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env          # optional — SQLite works out of the box
python main.py
```

- API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs
- Health: http://localhost:8000/api/v1/health

## API overview (`/api/v1`)

| Area | Prefix | Auth |
|------|--------|------|
| Health | `/health`, `/` | No |
| Auth | `/auth/register`, `/auth/login`, `/auth/me` | Register/login: no; me: yes |
| Classes | `/classes` | Yes |
| Students | `/students` | Yes |
| Tasks | `/tasks` | Yes (submissions: public if published) |
| Attendance | `/attendance` | Yes |
| Homework | `/homework` | Yes |
| Schedule | `/schedule` | Yes |
| Forms (legacy) | `/forms`, `/forms/public/{id}` | Mixed |
| Lesson plans | `/lesson-plans` | Yes |

Send `Authorization: Bearer <token>` for protected routes.

## Database

Default: **SQLite** file `grooveteach.db` in `backend/`. Tables are created on startup.

For PostgreSQL, set in `.env`:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/grooveteach
```

## Next steps

- Alembic migrations for production schema changes
- Wire `teachtrack` and `PulseBox` frontends to these endpoints
- Object storage for file uploads
- AI job queue for lesson plans / grading
