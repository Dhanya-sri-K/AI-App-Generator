# 🤖 AI App Generator (Track A - End-to-End Platform)

A powerful, metadata-driven application runtime that transforms JSON configurations into production-ready full-stack applications. This project satisfies all core requirements and includes advanced features like Authentication, Multi-language support, and PWA capabilities.

---

## 🌟 Key Features

### 1. **Metadata-Driven UI & Engine**
- **Dynamic Rendering**: Automatically generates premium UIs (Tables, Forms, Dashboards) from JSON.
- **Virtual DB Schema**: Flexible data storage in PostgreSQL without migration bottlenecks.
- **Backend Runtime**: Automated API and CRUD handling based on app metadata.

### 2. **Advanced Functionality**
- **🔐 Multi-Auth**: Integrated NextAuth.js for secure user management.
- **🌍 i18n (Multi-language)**: Instant translation switching (Demo: EN/ES).
- **🔔 Notification Hub**: Real-time alert center for system and workflow messages.
- **⚡ Workflow Automation**: Trigger logic (`ON_CREATE`, etc.) for business automation.
- **📊 CSV Operations**: Seamless data import/export with automatic mapping.
- **📁 Project Export**: Download your entire app metadata as a deployable ZIP.
- **📲 Mobile/PWA**: Responsive design with Progressive Web App support.

---

## 🛠 Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, Framer Motion.
- **Backend**: Node.js, NextAuth.js, Server Actions.
- **Database**: PostgreSQL (Neon.tech), Prisma ORM.
- **Tools**: Zod, PapaParse, JSZip, bcryptjs.

---

## 🚀 Step-by-Step Installation Guide

### Step 1: Clone & Install Dependencies
Open your terminal in the project root and run:
```powershell
npm install
```

### Step 2: Configure Environment Variables
Create a file named `.env` in the root directory and add your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 3: Setup the Database
Synchronize the schema with your database (this will create all required tables including Auth and Notifications):
```powershell
npx prisma db push
```

### Step 4: Generate Prisma Client
Ensure your client is up to date with the latest models:
```powershell
npx prisma generate
```
> **Note**: If you get a "Permission Denied" error on Windows, stop the dev server and try again.

### Step 5: Launch the Application
Start the development server:
```powershell
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to experience the dynamic platform.

### Step 6: Deploy to a public URL
See **[DEPLOY.md](./DEPLOY.md)** for hosting on Vercel (free `https://your-app.vercel.app` link).

---

## 📖 How to Use the Platform

### 1. **Switching Languages**
Locate the language dropdown in the sidebar to switch between **English** and **Spanish**. Watch the entire UI translate instantly!

### 2. **Managing Data**
Use the **Dashboard** or **Table** view to create records. Try clicking **"Import CSV"** to bulk-upload data using the sample files provided.

### 3. **Observing Workflows**
When you create a record, check the **Workflows** page. The system is configured to trigger automatic logging for new contacts.

### 4. **Authentication**
Use the **Login/Logout** buttons in the sidebar header to test the secure access flow.

### 5. **Export**
Click **"Export Project"** in the sidebar to get a full backup of your JSON metadata and README in a ZIP file.

---

## 📐 Architecture
The platform operates on a **Single-Source-of-Truth** principle. The `AppConfig` metadata defines everything from field types to language translations. The `Renderer` component selects the appropriate layout strategy, while the `Runtime` ensures all data operations follow the metadata rules.
