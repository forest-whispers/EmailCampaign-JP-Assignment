# EmailCampaign — API 3 Automation System

A full-stack lead management and email automation system built for the Singing Bowls export workflow.

The application follows:

**Lead Discovery → Validation → AI Classification → Campaign → Email Sending → Reporting**

## Core Features

### 👥 Lead Management

- Create and manage leads.
- Import leads through CSV.
- Search and filter leads.
- Pagination and bulk deletion.
- Duplicate email detection.
- Email status tracking:
  - `VALID`
  - `INVALID`
  - `MISSING`

### 🤖 AI Lead Classification

- Classifies eligible leads using Google Gemini.
- Leads are classified as:
  - `BUSINESS`
  - `INDIVIDUAL`
- Classification is triggered from the Leads page.
- The backend controls batch selection and eligibility.

### 📧 Campaign Management

- Create, edit, view, and delete campaigns.
- Target either Business or Individual leads.
- Select eligible leads for a campaign.
- Send personalized emails through Gmail SMTP.
- Attach the configured product presentation PDF.
- Track recipient status:
  - `PENDING`
  - `SENT`
  - `FAILED`

Supported email placeholders:

```text
{username}
{companyName}
{email}
{website}
{country}
```

Personalization is performed by the backend when sending.

### 📊 Dashboard

The `/dashboard` page provides operational reporting:

- Total leads
- Email status breakdown
- Business / Individual / Unclassified leads
- Lead sources
- Total campaigns
- Sent / Failed / Pending emails

### ⚙️ Settings

The `/settings` page provides campaign configuration using the existing Campaign APIs.

There is intentionally no separate Settings backend model or API.

---

## Application Flow

```text
                    ┌───────────────┐
                    │  Lead Sources │
                    └───────┬───────┘
                            ▼
                    ┌───────────────┐
                    │ Lead Manager  │
                    │ Create / CSV  │
                    └───────┬───────┘
                            ▼
                    ┌───────────────┐
                    │Email Validation│
                    └───────┬───────┘
                            ▼
                    ┌───────────────┐
                    │ AI Classifier │
                    │    Gemini     │
                    └───────┬───────┘
                            ▼
                    ┌───────────────┐
                    │   Campaign    │
                    └───────┬───────┘
                            ▼
                    ┌───────────────┐
                    │ Email Sending │
                    │ Gmail + PDF   │
                    └───────┬───────┘
                            ▼
                    ┌───────────────┐
                    │   Reporting   │
                    └───────────────┘
```

---

## Architecture

The project uses a React frontend and Node.js/Express backend with feature-oriented modules.

```text
EmailCampaign-JP-Assignment/
│
├── client/
│   └── src/
│       ├── app/
│       └── features/
│           ├── auth/
│           ├── leads/
│           ├── classification/
│           ├── campaigns/
│           ├── reports/
│           └── settings/
│
├── server/
│   ├── prisma/
│   ├── assets/
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   ├── leads/
│       │   ├── classification/
│       │   ├── campaign/
│       │   └── reports/
│       └── shared/
│
└── package.json
```

---

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| POST | `/api/leads` | Create / import leads |
| GET | `/api/leads` | List/search/filter leads |
| PATCH | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads` | Bulk delete |
| POST | `/api/leads/classify` | AI classification |
| POST | `/api/campaigns` | Create campaign |
| GET | `/api/campaigns` | List campaigns |
| GET | `/api/campaigns/:id` | Campaign details |
| PATCH | `/api/campaigns/:id` | Update campaign |
| DELETE | `/api/campaigns/:id` | Delete campaign |
| POST | `/api/campaigns/:id/send` | Send campaign |
| GET | `/api/reports` | Dashboard metrics |

---

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | React + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Server State | TanStack Query |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Authentication | JWT + HttpOnly Cookie |
| AI | Google Gemini |
| Email | Nodemailer + Gmail SMTP |
| CSV | PapaParse |

---

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL
- Gemini API key
- Gmail account with an App Password

### Install

From the project root:

```bash
npm run install-all
```

### Environment

Create `server/.env`:

```env
DATABASE_URL="your-postgresql-connection-string"

NODE_ENV="development"
PORT="3000"
CLIENT_URL="http://localhost:5173"

JWT_SECRET="your-jwt-secret"

GEMINI_API_KEY="your-gemini-api-key"

GMAIL_USER="your-gmail-address"
GMAIL_APP_PASSWORD="your-gmail-app-password"

PRESENTATION_PATH="./assets/presentation.pdf"
```

### Database

```bash
npm run prisma:migrate
npm run prisma:seed
```

### Run

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3000`

### Build

```bash
npm run build
```

---

## Demo Assets

The repository includes:

```text
server/assets/
├── demo-leads.csv
└── presentation.pdf
```

The CSV can be imported directly through the Leads page.

The PDF is used as the campaign email attachment.

---

## Engineering Decisions

### Backend-Owned Business Rules

Validation, duplicate detection, classification eligibility, campaign sending rules, personalization, and recipient tracking remain on the backend.

### Deterministic Rules + AI

Simple predictable operations such as email validation use deterministic rules, while Gemini is used for semantic lead classification.

### Campaign Recipient Tracking

Campaign configuration and recipient delivery state are separate so that the same lead can participate in multiple campaigns.

### Cookie-Based Authentication

Authentication uses an HttpOnly cookie. JWTs are not stored in browser storage or exposed to frontend JavaScript.

### Feature-Oriented Structure

Frontend and backend functionality is organized around business features to keep related logic together and avoid a large global controller/service structure.

---

## Limitations & Future Improvements

The current implementation is intentionally scoped to the assignment.

Possible future improvements include:

- Background email queues and retry processing
- Gmail OAuth integration
- Automated lead discovery from external sources
- Email open/click tracking
- Advanced campaign analytics
- Role-based access control
- Multi-user organizations
- Scheduled campaigns
- More advanced lead enrichment and classification

---

## Live Demo

**GitHub:** [https://github.com/forest-whispers/EmailCampaign-JP-Assignment](https://github.com/forest-whispers/EmailCampaign-JP-Assignment)

**Live Frontend:** [https://email-campaign-jp-assignment.vercel.app/](https://email-campaign-jp-assignment.vercel.app/)