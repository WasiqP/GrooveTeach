# GrooveTeach / PulseBox — Backend Developer Handoff

**Document purpose:** Single source of truth for **product scope**, **functional requirements**, **data/schema expectations**, and **what the mobile app and web frontends implement today** (as of repository state). This is intended for backend/API design, database modeling, and integration planning.

**Repository layout (high level):**

| Path | Description |
|------|-------------|
| `PulseBox/` | **React Native** mobile app (iOS & Android) — teacher-focused UI |
| `Website-FrontEnd/PulseBox/` | **Vite + React** web app — marketing site + logged-in teacher web console |
| `PulseBox/web/` | **Static** HTML/JS/CSS “form viewer” for shared links (legacy feedback-collector flow; API placeholders) |
| `README.md`, `PulseBox/AI_TEACHER_ASSISTANT_PLAN.md`, `PulseBox/PULSEBOX_PLAN.md` | Product and historical planning docs |

---

## 1. Product vision and scope

### 1.1 Problem statement

Teachers spend disproportionate time on administration (planning, attendance, grading, reporting, parent communication). **PulseBox** is positioned as an **AI-assisted personal assistant for teachers** to reduce that burden and keep focus on instruction.

### 1.2 Target users

- **Primary:** Classroom teachers (K–12 and beyond, including college/university in the web data model).
- **Secondary (future):** School admins, parents (read-only or communication endpoints).

### 1.3 Core capability areas (product scope)

The following are **in scope** for the product long-term (from `README.md` and `PulseBox/AI_TEACHER_ASSISTANT_PLAN.md`):

1. **Class and cohort management** — classes, optional multi-subject / parent–child class hierarchy (web), students per class.
2. **Attendance** — per-class, per-date, per-student status; history and analytics.
3. **Tasks / quizzes / assignments** — authoring, question types, publishing, share links, optional “take” experience for students/guests.
4. **Homework** — assign, track submissions, grades/feedback (web model).
5. **Lesson planning** — UI placeholders; AI generation is a **planned** backend + AI integration.
6. **Scheduling / calendar** — events linked optionally to classes (web context model).
7. **Analytics** — dashboards and reporting (mostly UI scaffolding; needs real metrics from backend).
8. **Authentication and accounts** — required for production; **not wired to a real backend** in the current frontends.
9. **Legacy “feedback forms” flow** (original PulseBox concept) — form builder + shareable web viewer + responses; still partially reflected in mobile screens and static `PulseBox/web/`.

### 1.4 Explicit out-of-scope or TBD for backend

- **AI features** (lesson generation, grading, chat, report comments) require **LLM and optional OCR** services — frontends are largely UI-only; contracts are not finalized in code.
- **Payments / subscriptions** — mentioned in planning docs; no stable implementation in repo.
- **Email/SMS to parents** — product intent exists; no production integration in frontends.

---

## 2. Technology stack (frontends only)

### 2.1 Mobile (`PulseBox/`)

- **React Native** `0.82.x`, **React** `19.x`
- **Navigation:** `@react-navigation/native`, `@react-navigation/native-stack`
- **Local persistence:** `@react-native-async-storage/async-storage`
- **Other:** `react-native-svg`, `react-native-qrcode-svg`, `react-native-view-shot`, safe area / screens

**There is no `fetch`/REST client usage in the mobile app for core data** — state is local (AsyncStorage) via React contexts.

### 2.2 Website (`Website-FrontEnd/PulseBox/`)

- **Vite** + **React** `19.x` + **TypeScript**
- **Routing:** `react-router-dom` v7
- **UI/animation:** Framer Motion, GSAP, Lottie, Three.js / OGL (marketing visuals), DnD Kit (task question reordering)
- **Persistence:** `localStorage` keys (see §4.2)

### 2.3 Static form viewer (`PulseBox/web/`)

- Plain HTML/CSS/JS; expects **configurable HTTP endpoints** for load + submit (placeholders point at `https://api.pulsebox.app/...` — must be replaced).

### 2.4 Planned backend (from docs, not implemented in repo)

Root `README.md` mentions **Firebase** (Firestore, Auth, Functions). **No Firebase SDK is listed in `PulseBox/package.json` today.** Treat Firebase as **documentation intent**, not current implementation.

---

## 3. Current implementation map (what exists in the UI)

### 3.1 Mobile app — navigation (`PulseBox/App.tsx`)

**Stack navigator** (no auth gate; starts at onboarding):

| Route | Screen | Notes |
|-------|--------|--------|
| `GetStarted` | Get started | Entry |
| `Onboarding01`–`03` | Onboarding | |
| `Login`, `SignUp` | Auth | **Mock:** Login navigates to `Home` without API |
| `Home` | Teacher dashboard | Uses `ClassesContext` |
| `MyForms` | **Routed to `Quizzes` component** | Legacy name |
| `MyClasses` | Class list | |
| `Quizzes` | Quizzes / assignments area | |
| `Responses` | Reframed as “Students” in UX | |
| `Settings` | Settings | |
| `LessonPlanner` | Lesson planner | |
| `Attendance` | Attendance | Params in types: `classId` |
| `CreateClass`, `ClassDetails` | Class CRUD/details | `ClassDetails` expects `classId` |
| `CreateForm`, `FormBuilder`, `EditForm`, `QuestionsScreen`, `SwapQuestions`, `ShareForm` | Legacy form/quiz builder | `FormsContext` |

**Declared in `RootStackParamList` but not all registered in `App.tsx`:** e.g. `Grading`, `StudentProfile`, `CreateAssignment`, `ParentCommunication`, `AIAssistant`, `Reports` — **types exist for future work; screens may be missing or incomplete.**

**Bottom tab** (`PulseBox/src/components/BottomTab.tsx`): Home, My Classes, Quizzes, Students (Responses), Settings.

### 3.2 Website — routes (`Website-FrontEnd/PulseBox/src/App.tsx`)

**Public / marketing**

- `/` Home, `/about`, `/pricing`, `/contact`
- `/login`, `/signup` — **mock:** submit navigates to `/app` without real auth

**Teacher app (`/app/...`)**

| Route | Purpose |
|-------|---------|
| `/app` | Dashboard |
| `/app/classes`, `/app/classes/create`, `/app/classes/edit/:id`, `/app/classes/:id` | Classes |
| `/app/mark-attendance` | Mark attendance |
| `/app/tasks`, `/app/tasks/create`, `/app/tasks/:taskId`, `.../questions`, `.../publish` | Tasks / quizzes pipeline |
| `/app/quizzes/create` | Alias to create task |
| `/app/lesson-plans` | Lesson plans |
| `/app/attendance` | Attendance overview |
| `/app/homework` | Homework |
| `/app/analytics` | Analytics |
| `/app/schedule` | Schedule |
| `/app/profile`, `/app/settings` | Profile / settings |

**Public task links**

- `/task/:taskId` — preview
- `/task/:taskId/take` — take task

**Known gap:** `App.tsx` imports `./pages/SchedulePage` for `/app/schedule`, but **no `SchedulePage.tsx` file is present in the snapshot** — the **schedule feature is modeled in `ScheduleContext`** only. Backend should not assume this route builds until the file is added or the import fixed.

---

## 4. Data models — what the frontends use today

These are **canonical for API design** so mobile and web can converge. Types are taken from React contexts.

### 4.1 Mobile — `FormsContext` (`PulseBox/src/context/FormsContext.tsx`)

**Storage key:** `forms` (AsyncStorage JSON array)

```ts
interface FormData {
  id: string;
  name: string;
  iconId: string;
  answers: any; // legacy bag for questions/structure
  createdAt: string; // ISO string
}
```

### 4.2 Mobile — `ClassesContext` (`PulseBox/src/context/ClassesContext.tsx`)

**Storage key:** `classes`

```ts
interface ClassData {
  id: string;
  name: string;
  subject: string;
  gradeLevel: string;
  studentCount: number;
  schedule: string;
  roomNumber?: string;
  createdAt: string; // ISO string
}
```

Seeded defaults exist if empty (demo classes).

### 4.3 Website — classes (`Website-FrontEnd/PulseBox/src/context/ClassesContext.tsx`)

**Storage key:** `pulsebox-classes`

Richer model than mobile:

```ts
interface Student {
  id: string;
  name: string;
  email: string;
}

interface Subject {
  id: string;
  name: string;
  description?: string;
}

interface ClassSchedule {
  startTime: string; // "HH:MM" 24h
  endTime: string;
  days: string[];    // e.g. ['Mon','Wed']
}

interface ClassData {
  id: string;
  name: string;
  classType: 'single-subject' | 'multi-subject';
  subject?: string;
  subjects?: Subject[];
  parentId?: string;
  childClassIds?: string[];
  educationLevel: 'school' | 'college' | 'high-school' | 'university' | 'virtual' | 'other';
  gradeLevel: string;
  schedule: ClassSchedule | string; // legacy string supported
  institutionName?: string;
  location?: string;
  roomNumber?: string;
  students: Student[];
  studentCount: number;
  createdAt: string;
}
```

### 4.4 Website — tasks / quizzes (`TasksContext`)

**Storage key:** `pulsebox-tasks`

```ts
type QuestionType =
  | 'shortText' | 'longText' | 'multipleChoice' | 'checkbox' | 'dropdown';

interface QuestionData {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
  description?: string;
  maxLength?: number;
  options?: string[];
  correctAnswers?: number[]; // option indices for auto-grade
  marks?: number;
}

interface TaskData {
  id: string;
  name: string;
  taskType: 'quiz' | 'test' | 'assignment' | 'homework';
  classId: string;
  subjectId?: string;
  dueDate: string;
  expectedTime: number;
  timeUnit: 'minutes' | 'hours';
  visibility: 'public' | 'class-only';
  requireIdentification: boolean;
  markingCriteria?: {
    totalMarks: number;
    passingMarks: number;
    passingPercentage: number;
    negativeMarking: boolean;
    negativeMarkingValue: number;
    autoGrade: boolean;
    markingScheme: 'equal' | 'weighted';
  };
  permissions: {
    lockScreen: boolean;
    preventTabSwitch: boolean;
    preventCopyPaste: boolean;
    showTimer: boolean;
  };
  displayMode?: 'single' | 'form';
  questions: QuestionData[];
  createdAt: string;
  published?: boolean;
  publishedAt?: string;
  shareLink?: string; // derived as `${origin}/task/${id}` on publish
}
```

**Publish behavior:** sets `published`, `publishedAt`, and a **client-origin** `shareLink`. Backend should generate canonical URLs and short codes if needed.

### 4.5 Website — attendance (`AttendanceContext`)

**Storage key:** `pulsebox-attendance`

```ts
type AttendanceStatus = 'present' | 'late' | 'absent';

interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;       // logical date string used in UI
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: AttendanceStatus;
  createdAt: string;
}
```

Uniqueness rule in UI: one record per `(classId, date, studentId)` — replacements update the same logical slot.

### 4.6 Website — homework (`HomeworkContext`)

**Storage key:** `pulsebox-homework`

```ts
type HomeworkStatus = 'pending' | 'submitted' | 'graded' | 'late';

interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt?: string;
  submittedContent?: string;
  attachmentUrl?: string;
  grade?: number;
  feedback?: string;
  status: HomeworkStatus;
  createdAt: string;
}

interface Homework {
  id: string;
  classId: string;
  title: string;
  description: string;
  subject?: string;
  dueDate: string;
  assignedDate: string;
  maxGrade?: number;
  submissions: HomeworkSubmission[];
  totalStudents: number;
  createdAt: string;
}
```

### 4.7 Website — schedule (`ScheduleContext`)

**Storage key:** `pulsebox-schedule`

```ts
type EventType =
  | 'class' | 'meeting' | 'office-hours' | 'grading' | 'lesson-planning'
  | 'professional-development' | 'personal' | 'other';

interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  startTime: string; // ISO
  endTime: string;
  allDay?: boolean;
  classId?: string;
  location?: string;
  attendees?: string[];
  reminder?: { enabled: boolean; minutesBefore: number };
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
    daysOfWeek?: number[];
  };
  color?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Recommended unified backend schema (for API / SQL / Firestore)

The following merges **planned Firestore structure** from `AI_TEACHER_ASSISTANT_PLAN.md`, **legacy forms** from `PULSEBOX_PLAN.md`, and **actual TypeScript shapes** from the web app. Adjust naming to your stack (snake_case vs camelCase; collections vs tables).

### 5.1 Users / teachers

| Field | Type | Notes |
|-------|------|--------|
| `id` | UUID | |
| `email` | string | unique |
| `name` | string | |
| `schoolName` / `institutionName` | string | optional |
| `subjects` | string[] | optional |
| `avatarUrl` | string | optional |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

### 5.2 Classes

Align with **web** `ClassData` as source of truth; mobile can be migrated.

| Field | Type | Notes |
|-------|------|--------|
| `id` | UUID | |
| `teacherId` | FK → users | owner |
| `name` | string | |
| `classType` | enum | `single-subject` \| `multi-subject` |
| `subject` | string | if single-subject |
| `subjects` | `{ id, name, description? }[]` | if multi-subject |
| `parentId` | UUID nullable | child subject class |
| `childClassIds` | UUID[] | denormalized optional |
| `educationLevel` | enum | as in web |
| `gradeLevel` | string | |
| `schedule` | object or string | structured preferred: days + start/end |
| `roomNumber`, `location`, `institutionName` | strings | optional |
| `createdAt`, `updatedAt` | timestamp | |

### 5.3 Students

Either nested under class enrollment or global with join table.

| Field | Type | Notes |
|-------|------|--------|
| `id` | UUID | |
| `name` | string | |
| `email` | string | optional; used in attendance |
| `classIds` | UUID[] | or separate `enrollments` table |
| `parentEmail`, `parentPhone` | string | optional |
| `createdAt` | timestamp | |

### 5.4 Tasks (assignments / quizzes / homework papers)

Map from `TaskData` + server fields:

| Field | Type | Notes |
|-------|------|--------|
| `id` | UUID | |
| `teacherId` | FK | |
| `classId` | FK | |
| `subjectId` | FK optional | |
| `name`, `taskType`, `dueDate` | | |
| `expectedTime`, `timeUnit` | | |
| `visibility` | enum | `public` \| `class-only` |
| `requireIdentification` | bool | |
| `markingCriteria`, `permissions`, `displayMode` | JSON | as in TS |
| `questions` | JSON array | `QuestionData[]` |
| `published` | bool | |
| `publishedAt` | timestamp | |
| `shareToken` or `slug` | string | for public URLs |
| `createdAt`, `updatedAt` | timestamp | |

### 5.5 Task attempts / submissions (for grading)

Not fully modeled in contexts; required for production:

| Field | Type | Notes |
|-------|------|--------|
| `id` | UUID | |
| `taskId` | FK | |
| `studentId` | FK nullable | if guest, use session + identification |
| `answers` | JSON | field id → value |
| `score` | number | optional |
| `submittedAt` | timestamp | |
| `gradedAt` | timestamp | optional |

### 5.6 Attendance

| Field | Type | Notes |
|-------|------|--------|
| `id` | UUID | |
| `classId` | FK | |
| `date` | date | timezone policy TBD |
| `studentId` | FK | |
| `status` | enum | present \| late \| absent |
| `markedBy` | FK users | |
| `createdAt` | timestamp | |

Unique constraint: `(classId, date, studentId)`.

### 5.7 Homework (optional separate from `Task` if product keeps both)

If homework stays a first-class entity, map `Homework` + embedded or related `HomeworkSubmission` rows.

### 5.8 Schedule events

Map `ScheduleEvent`; enforce `startTime`/`endTime` as timestamptz; expand recurring server-side or store RRULE (future).

### 5.9 Legacy forms (from `PULSEBOX_PLAN.md`)

If the product still needs **generic feedback forms** (distinct from graded tasks):

**`forms`:** `id`, `userId`, `title`, `description`, `fields[]` (type, label, required, options), `isActive`, `shareableLink`, `responseCount`, timestamps.

**`responses`:** `id`, `formId`, `answers`, `submittedAt`, optional `respondentEmail`.

### 5.10 Parent messages (planned)

Per `AI_TEACHER_ASSISTANT_PLAN.md`: `teacherId`, `studentId`, `parentEmail`, `subject`, `message`, `sentAt`, `read`.

### 5.11 Lesson plans (planned)

Per plan: `teacherId`, `classId?`, `title`, `subject`, `gradeLevel`, `objectives[]`, `activities`, `materials[]`, `duration`, `aiGenerated`, timestamps.

---

## 6. API and integration requirements (backend)

### 6.1 Authentication and authorization

- Frontends currently **do not validate tokens**. Production requires:
  - **Teacher-only** routes for class/task/attendance data.
  - **Optional public** routes for published tasks (`/task/:id` preview and take) with abuse protection (rate limits, optional CAPTCHA).
  - **Row-level** access: teachers only see their org/classes (define multi-tenant rules).

### 6.2 Idempotency and offline (mobile)

- Mobile may need **sync** later; design APIs with **ETags**, **version fields**, or **event log** if offline-first is a goal.

### 6.3 Static web form viewer contract (`PulseBox/web/`)

Documented expected shapes (see `PulseBox/web/README.md`):

**GET** load form (example path in config): returns JSON including `id`, `name`, `description`, `answers` array of question definitions.

**POST** submit: body includes `formId`, `answers` map, `submittedAt`.

Replace placeholder base URLs (`https://api.pulsebox.app/...`) with real endpoints and CORS policy for static hosting.

### 6.4 File uploads

- Homework `attachmentUrl` and future student work imply **object storage** (signed URLs) — not implemented in frontends.

### 6.5 AI (future)

- Lesson plans, rubric-based grading, chat: **async jobs** recommended (queue + webhooks or polling) with cost controls.

---

## 7. Non-functional requirements (from product docs)

- **Privacy / compliance:** Student data handling (e.g. FERPA-style obligations) mentioned in planning — define data retention, export, deletion, and audit logs.
- **Security:** HTTPS, secure cookies or Bearer tokens for web; mobile secure storage for tokens.
- **Observability:** Structured logging, metrics for API latency and AI job failures.

---

## 8. Gaps and inconsistencies to resolve with product/frontend

1. **Mobile vs web `ClassData`** — different shapes; **standardize on web model** or provide API versioning + adapters.
2. **`SchedulePage` missing** in website while route exists — fix build or remove route until implemented.
3. **Branding:** Web auth UI references “Raviro” in one place; product name is PulseBox — cosmetic but confusing in demos.
4. **Navigation types vs registered screens** on mobile — several typed routes are not in `App.tsx`.
5. **No shared API layer** — introduce OpenAPI or tRPC schema once backend exists so both clients codegen clients.

---

## 9. Summary for backend planning

| Area | Frontend status | Backend expectation |
|------|-------------------|---------------------|
| Auth | Mock / local only | Real identity provider + sessions/JWT |
| Classes | Web: rich model + localStorage; Mobile: simpler + AsyncStorage | Unified CRUD + enrollment |
| Tasks / quizzes | Web: full `TaskData` + publish links | Persist + authz + public share tokens |
| Attendance | Web: full records | Bulk write + reporting queries |
| Homework | Web: model present | Optional merge with tasks or separate service |
| Schedule | Context only; page may be missing | Calendar API + timezone rules |
| Forms legacy | Mobile + static web | Optional separate microservice or unified “assessment” model |
| AI | Not wired | Job APIs + storage for generated artifacts |

---

*Generated from the GrooveTeach monorepo structure and source files. Update this document when API contracts are fixed or frontends connect to a real backend.*
