# Energy Body & Mind Tool

A Fast Track diagnostic tool for designing personal energy protocols across 4 pillars: Sleep, Food, Movement, and Brain.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd specenergy_spec-kit-for-curosr-agent-ps-v0.0.90
```

2. **Install dependencies**
```bash
cd apps/web
npm install
```

3. **Set up environment variables**

Create `apps/web/.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

4. **Run database migrations**

Go to your Supabase SQL editor and run:
```sql
-- See: apps/web/supabase/migrations/001_create_energy_submissions.sql
```

5. **Start development servers**
```bash
npm run dev:all  # Runs both frontend + API backend
```

Visit http://localhost:3000

---

## 🌐 Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Energy Body & Mind Tool"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables in Vercel

Go to **Project Settings → Environment Variables** and add:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete.

---

## 📁 Project Structure

```
apps/web/
├── api/                          # Vercel Serverless Functions
│   ├── _lib/
│   │   └── db.ts                # Supabase client (server)
│   └── submissions/
│       ├── submit.ts            # POST /api/submissions/submit
│       └── list.ts              # GET /api/submissions/list
├── src/
│   ├── domain/                  # Business logic (entities, value objects)
│   ├── application/             # Use cases, ports
│   ├── infrastructure/          # External services (Supabase, storage)
│   └── presentation/            # React components, pages, hooks
├── supabase/
│   └── migrations/              # Database schema
├── public/                      # Static assets
└── vercel.json                  # Vercel configuration
```

---

## 🎨 Features

### Individual Tool
- **Energy Audit**: Rate 4 pillars (Sleep, Food, Movement, Brain) 1-10
- **Energy Drains**: Identify top 3 energy drains
- **Protocol Design**: Create specific, actionable protocols
- **First Win**: Set 24-hour commitment
- **Visual Canvas**: Print-friendly protocol summary

### Guru Dashboard
- View all team submissions
- Aggregate pillar ratings
- Identify common energy drains
- Track completion rates

### Team Meeting Tool
- Compare protocols side-by-side
- Identify team patterns
- Facilitate energy discussions

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **State Management**: TanStack Query, React Hooks
- **Validation**: Zod
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure, Presentation)

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | ✅ Yes |

---

## 📊 Database Schema

### `energy_submissions` Table

```sql
CREATE TABLE energy_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_name TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  company_id TEXT NOT NULL,
  company_name TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'submitted',
  completion_percentage INTEGER NOT NULL DEFAULT 100,
  tool_data JSONB NOT NULL
);
```

---

## 🧪 API Endpoints

### Submit Protocol
```http
POST /api/submissions/submit
Content-Type: application/json

{
  "userId": "user@company.com",
  "userName": "John Doe",
  "companyId": "fast-track",
  "companyName": "Fast Track",
  "toolData": { ... }
}
```

### List Submissions
```http
GET /api/submissions/list?companyId=fast-track
```

---

## 📝 Development Commands

```bash
# Start both frontend + API (development)
npm run dev:all

# Start frontend only
npm run dev

# Start API backend only
npm run dev:api

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎯 Design System

- **Typography**: Plaak (headings), Riforma (body), Monument (labels)
- **Colors**: Black (#000000), White (#FFFFFF), Yellow (#FFD700)
- **Spacing**: 8px grid system
- **Animations**: 150ms-600ms transitions

---

## 📄 License

[Your License Here]

---

## 🤝 Contributing

[Your Contributing Guidelines Here]

---

## 📞 Support

[Your Support Contact Here]

