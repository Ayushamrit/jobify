<h1 align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=40&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=Jobify+%F0%9F%92%BC;Your+Smart+Job+Portal" alt="Jobify" />
</h1>

<p align="center">
  <b>A modern, full-stack job portal platform connecting job seekers with top companies — powered by AI, built for everyone.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Running with Docker](#running-with-docker)
- [API Endpoints](#-api-endpoints)
- [Data Models](#-data-models)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Jobify** is a feature-rich, full-stack job portal web application that bridges the gap between talented job seekers and top-tier companies. It provides a seamless experience for both students/job seekers and recruiters — from browsing thousands of jobs to managing applications and company profiles, all in one place.

Built with a **React + Vite** frontend and a **Node.js + Express** backend, Jobify leverages **MongoDB** for data persistence, **Cloudinary** for file/media storage, **Firebase** for authentication, and includes an **AI Assistant** to supercharge your job search.

---

## ✨ Features

### 👨‍💼 For Job Seekers (Students)
- 🔍 **Browse & Search Jobs** — Filter by location, job type, work mode, salary, and more
- 📝 **Apply to Jobs** — One-click job applications with resume upload
- 💾 **Save Jobs** — Bookmark interesting positions for later
- 🧑‍💻 **Profile Management** — Update bio, skills, profile photo, and resume
- 📊 **Application Tracker** — Track the status of all your job applications
- 🤖 **AI Job Assistant** — Get personalized job recommendations and career advice
- 🏢 **Company Explorer** — Browse detailed company profiles with reviews
- 🌐 **External Job Portals** — Discover jobs from Adzuna and other platforms
- ⭐ **Company Reviews** — Read and write reviews for companies
- 📂 **Category Carousel** — Browse jobs by category

### 🏢 For Recruiters
- 🏗️ **Company Registration** — Register and manage your company profile
- 📋 **Job Posting** — Post detailed job listings with perks, deadlines, work mode, and more
- 👥 **Applicant Management** — View, shortlist, and manage candidates
- 📈 **Dashboard Analytics** — Visualize hiring stats with charts and graphs (Recharts)
- 🔄 **Application Status Updates** — Accept or reject applicants in real-time

### 🔐 Authentication & Security
- JWT-based authentication with HTTP-only cookies
- Firebase OAuth integration for social login
- Role-based access control (Student / Recruiter)
- Secure password hashing with **bcryptjs**

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | Core UI framework |
| **Vite** | Lightning-fast build tool |
| **TailwindCSS 3** | Utility-first styling |
| **Redux Toolkit** | Global state management |
| **Redux Persist** | Persisting auth state across sessions |
| **React Router DOM v6** | Client-side routing |
| **Axios** | HTTP requests |
| **Firebase** | OAuth / social authentication |
| **Framer Motion** | Smooth animations |
| **Radix UI** | Accessible UI primitives (Dialog, Select, Avatar, etc.) |
| **Recharts** | Charts & data visualization |
| **Lucide React** | Icons |
| **Sonner** | Toast notifications |
| **Embla Carousel** | Carousel component |
| **next-themes** | Dark/Light mode support |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Cloudinary** | Profile photo & resume storage |
| **Multer** | File upload handling |
| **Firebase Admin SDK** | Server-side Firebase auth verification |
| **cookie-parser** | Cookie management |
| **CORS** | Cross-origin request handling |
| **dotenv** | Environment variable management |
| **Nodemon** | Auto-restart in development |

### DevOps & Deployment
| Technology | Purpose |
|---|---|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Frontend static file serving |
| **Vercel** | Frontend deployment (optional) |

---

## 📁 Project Structure

```
jobify/
├── 📄 docker-compose.yml          # Multi-container Docker setup
├── 📄 package.json                # Root scripts (concurrent dev)
│
├── 🖥️ backend/
│   ├── 📄 index.js                # Express app entry point
│   ├── 📄 Dockerfile              # Backend Docker image
│   ├── 📄 .env.example            # Environment variable template
│   ├── 📁 controllers/            # Business logic handlers
│   │   ├── user.controller.js     # User auth & profile logic
│   │   ├── job.controller.js      # Job CRUD & search logic
│   │   ├── company.controller.js  # Company management logic
│   │   ├── application.controller.js  # Job application logic
│   │   ├── review.controller.js   # Company review logic
│   │   ├── savedJob.controller.js # Save/unsave job logic
│   │   └── ai.controller.js       # AI assistant logic
│   ├── 📁 models/                 # Mongoose data models
│   │   ├── user.model.js
│   │   ├── job.model.js
│   │   ├── company.model.js
│   │   ├── application.model.js
│   │   ├── review.model.js
│   │   └── savedJob.model.js
│   ├── 📁 routes/                 # Express route definitions
│   │   ├── user.route.js
│   │   ├── job.route.js
│   │   ├── company.route.js
│   │   ├── application.route.js
│   │   ├── review.route.js
│   │   ├── savedJob.route.js
│   │   └── ai.route.js
│   ├── 📁 middlewares/            # Auth & file middlewares
│   └── 📁 utils/                  # DB connection, helpers
│
└── 🌐 frontend/
    ├── 📄 index.html              # HTML entry point
    ├── 📄 vite.config.js          # Vite configuration
    ├── 📄 tailwind.config.js      # Tailwind configuration
    ├── 📄 Dockerfile              # Frontend Docker image
    ├── 📄 nginx.conf              # Nginx config for production
    ├── 📄 vercel.json             # Vercel deployment config
    └── 📁 src/
        ├── 📄 App.jsx             # Root component & routes
        ├── 📄 main.jsx            # React entry point
        ├── 📄 firebase.js         # Firebase client config
        ├── 📁 components/         # UI components
        │   ├── Home.jsx           # Home / landing page
        │   ├── HeroSection.jsx    # Hero banner
        │   ├── Jobs.jsx           # Job listings page
        │   ├── Job.jsx            # Job card component
        │   ├── JobDescription.jsx # Full job details page
        │   ├── Browse.jsx         # Browse all jobs
        │   ├── Profile.jsx        # User profile page
        │   ├── Dashboard.jsx      # Recruiter dashboard
        │   ├── AIAssistant.jsx    # AI job assistant
        │   ├── CompanyDetails.jsx # Company detail view
        │   ├── JobPortals.jsx     # External job portals
        │   ├── SavedJobs.jsx      # Saved/bookmarked jobs
        │   ├── AppliedJobTable.jsx# Applied jobs tracker
        │   ├── FilterCard.jsx     # Job filters sidebar
        │   ├── CategoryCarousel.jsx# Job category carousel
        │   ├── LatestJobs.jsx     # Latest job listings
        │   ├── HowItWorks.jsx     # How it works section
        │   ├── Testimonials.jsx   # User testimonials
        │   ├── UpdateProfileDialog.jsx # Profile edit dialog
        │   ├── 📁 admin/          # Recruiter-only components
        │   ├── 📁 auth/           # Login / Register pages
        │   ├── 📁 shared/         # Navbar, Footer, etc.
        │   └── 📁 ui/             # Reusable UI primitives
        ├── 📁 redux/              # Redux store & slices
        ├── 📁 hooks/              # Custom React hooks
        ├── 📁 utils/              # API constants, helpers
        └── 📁 lib/                # Utility functions
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Docker](https://www.docker.com/) (optional, for containerized setup)
- A [Cloudinary](https://cloudinary.com/) account
- A [Firebase](https://firebase.google.com/) project

---

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayushamrit/jobify.git
   cd jobify
   ```

2. **Install all dependencies** (both frontend and backend)
   ```bash
   npm run install-all
   ```

   Or install them separately:
   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install
   ```

---

### Environment Variables

#### Backend (`backend/.env`)

Copy the example file and fill in your values:
```bash
cp backend/.env.example backend/.env
```

```env
# Server
PORT=8000

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
SECRET_KEY=your_super_secret_jwt_key

# Cloudinary (for photo & resume uploads)
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# External Job APIs
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
RAPIDAPI_KEY=your_rapidapi_key

# Firebase Admin SDK (from Project Settings → Service Accounts)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

#### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### Running Locally

Start both frontend and backend concurrently from the **root** directory:

```bash
npm run dev
```

Or start them individually:

```bash
# Start backend only (runs on http://localhost:8000)
npm run backend

# Start frontend only (runs on http://localhost:5173)
npm run frontend
```

---

### Running with Docker

Make sure Docker Desktop is running, then from the root directory:

```bash
docker-compose up --build
```

This will spin up:
- 🖥️ **Backend** → `http://localhost:8000`
- 🌐 **Frontend** → `http://localhost:80`

To stop the containers:
```bash
docker-compose down
```

---

## 📡 API Endpoints

All API routes are prefixed with `/api/v1`

### 👤 User Routes — `/api/v1/user`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login with email & password | ❌ |
| `GET` | `/logout` | Logout current user | ✅ |
| `POST` | `/profile/update` | Update user profile & resume | ✅ |

### 🏢 Company Routes — `/api/v1/company`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/register` | Register a new company | ✅ |
| `GET` | `/get` | Get all companies for recruiter | ✅ |
| `GET` | `/get/:id` | Get company by ID | ✅ |
| `PUT` | `/update/:id` | Update company details | ✅ |

### 💼 Job Routes — `/api/v1/job`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/post` | Post a new job | ✅ |
| `GET` | `/get` | Get all active jobs (with filters) | ❌ |
| `GET` | `/getadminjobs` | Get jobs posted by recruiter | ✅ |
| `GET` | `/get/:id` | Get job by ID | ❌ |

### 📩 Application Routes — `/api/v1/application`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/apply/:id` | Apply for a job | ✅ |
| `GET` | `/get` | Get applied jobs (student) | ✅ |
| `GET` | `/applicants/:id` | Get applicants for a job (recruiter) | ✅ |
| `POST` | `/status/:id/update` | Update application status | ✅ |

### ⭐ Review Routes — `/api/v1/review`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/post` | Post a company review | ✅ |
| `GET` | `/:companyId` | Get reviews for a company | ❌ |

### 🔖 Saved Job Routes — `/api/v1/saved-job`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/save/:jobId` | Save / unsave a job | ✅ |
| `GET` | `/all` | Get all saved jobs | ✅ |

### 🤖 AI Routes — `/api/v1/ai`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/chat` | Chat with AI job assistant | ✅ |

---

## 🗂️ Data Models

### User
```
fullname, email, phoneNumber, password, role (student|recruiter)
profile: { bio, skills[], resume, resumeOriginalName, company, profilePhoto }
```

### Job
```
title, description, requirements[], salary, experienceLevel, location
jobType, workMode (Remote|Hybrid|On-site), perks[], applicationDeadline
isActive, position, company (ref), created_by (ref), applications[]
```

### Company
```
name, description, website, location, logo, industry
employeeCount, foundedYear, socialLinks: { linkedin, twitter }, userId (ref)
```

### Application
```
job (ref), applicant (ref), status (pending|accepted|rejected)
```

### Review
```
company (ref), user (ref), rating, comment
```

### SavedJob
```
user (ref), job (ref)
```

---

## 🤝 Contributing

Contributions are always welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push** to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a **Pull Request**

Please make sure your code follows the existing code style and includes appropriate comments.

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Ayushamrit">Ayushamrit</a>
</p>

<p align="center">
  ⭐ If you found this project helpful, please give it a star!
</p>
