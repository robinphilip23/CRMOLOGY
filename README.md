# CRMOLOGY: Zero-Data-Entry CRM

CRMOLOGY is an AI-native Customer Relationship Management (CRM) platform designed to eliminate manual data entry. Built with modern web technologies, it features an intelligent agent that automatically parses inbound communications, extracts key deal data, and manages your pipeline with minimal user intervention.

## 🚀 Features

- **Zero-Data-Entry Pipeline**: AI automatically identifies leads and deal values from communications.
- **Smart Inbox**: Inbound messages are pre-parsed for Intent and Confidence Scoring.
- **Multi-Tenant Architecture**: Strict data isolation with PostgreSQL Row-Level Security (RLS).
- **Passwordless Authentication**: Secure login via Magic Links and OAuth.
- **Modern UI/UX**: Built with Framer Motion and Tailwind CSS for fluid, glassmorphic interactions.

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui, Framer Motion
- **Backend & Database**: Supabase (PostgreSQL)
- **Auth**: `@supabase/ssr`

## ⚙️ Local Development

### 1. Clone the repository
```bash
git clone https://github.com/robinphilip23/CRMOLOGY.git
cd CRMOLOGY
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials. **Never commit this file.**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Execute the required database schema (including `tenants` and `profiles` tables, RLS policies, and triggers) in your Supabase SQL Editor to enable multi-tenancy.

### 5. Run the server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔒 Security

This repository does not track `.env` files or local AI assistant configurations to ensure sensitive credentials and API keys are kept secure. Multi-tenancy is enforced natively at the database level via Supabase RLS.
