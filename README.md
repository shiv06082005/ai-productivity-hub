# 🚀 AI Productivity Hub

An all-in-one AI-powered productivity platform built using **Next.js, TypeScript, Tailwind CSS, NextAuth, and Groq AI**.

AI Productivity Hub brings multiple useful AI tools together in one platform to help users generate content, prepare for interviews, create business ideas, plan trips, build professional resumes, analyze resumes, manage emails, and organize their studies using Artificial Intelligence.

---

## 🌐 Live Demo

🚀 **[View Live Project](https://ai-productivity-hub-nine.vercel.app/)**

---

## ✨ Features

### 📊 Dashboard

A centralized dashboard that provides access to all AI productivity tools from one platform.

### 🔐 User Authentication

Secure user authentication using **GitHub OAuth** powered by **NextAuth**.

Users must log in before accessing the AI Productivity Hub.

Features include:

- Secure GitHub Login
- Protected Dashboard
- User Profile Information
- Secure Logout

### 🤖 AI Chat

Interact with an AI-powered assistant and get intelligent responses to your questions.

### 📝 AI Blog Generator

Generate detailed and professional blog content using Artificial Intelligence.

### 💡 AI Business Idea Generator

Generate complete startup and business ideas including:

- Business Name
- Business Idea
- Problem Solved
- Target Audience
- Revenue Model
- Marketing Strategy
- Estimated Cost
- Growth Plan
- Future Scope
- Conclusion

### 🎤 AI Interview Preparation

Prepare for interviews with AI-generated content including:

- Introduction
- HR Questions
- Technical Questions
- Sample Answers
- Interview Tips
- Salary Negotiation Tips
- Final Advice

### ✈️ AI Travel Planner

Generate personalized travel plans based on:

- Destination
- Number of Days
- Budget
- Number of Travelers

The AI provides:

- Travel Overview
- Day-wise Itinerary
- Best Hotels
- Best Restaurants
- Local Foods
- Places to Visit
- Estimated Expenses
- Travel Tips
- Packing List

### 📄 AI Resume Builder

Create professional and ATS-friendly resumes using:

- Full Name
- Education
- Skills
- Experience
- Career Objective

Additional features:

- 📋 Copy Resume
- 📄 Download Resume as PDF
- 🗑️ Clear Resume

### 🔍 AI Resume Analyzer

Analyze your resume using AI and receive useful feedback and suggestions to improve its quality and professionalism.

The analyzer supports resume text and PDF input along with a job description for more targeted analysis.

### 📚 Study Planner

Create personalized study plans and organize your learning schedule efficiently.

### 📧 Email Assistant

Generate professional email content with AI assistance for different communication needs.

### 🕒 History

Store and access previously generated AI content using local storage.

---

## 🛠️ Tech Stack

This project is built using:

- ⚛️ **Next.js**
- ⚛️ **React**
- 🔷 **TypeScript**
- 🎨 **Tailwind CSS**
- 🤖 **Groq AI API**
- 🔐 **NextAuth**
- 🐙 **GitHub OAuth**
- 📝 **React Markdown**
- 📄 **jsPDF**
- 📑 **PDF.js**
- 🎯 **React Icons**

---

## 📂 Project Structure

```text
ai-productivity-hub/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   ├── blog/
│   │   ├── business/
│   │   ├── chat/
│   │   ├── interview/
│   │   ├── resume/
│   │   ├── resume-analyzer/
│   │   └── travel/
│   │
│   ├── blog/
│   ├── business/
│   ├── chat/
│   ├── email/
│   ├── history/
│   ├── interview/
│   ├── login/
│   ├── resume/
│   ├── resume-analyzer/
│   ├── study-planner/
│   └── travel/
│
├── components/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── providers.tsx
│
├── public/
├── auth.ts
├── proxy.ts
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shiv06082005/ai-productivity-hub.git
```

### 2. Navigate to the Project Directory

```bash
cd ai-productivity-hub
```

### 3. Install Dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

Create a file named:

```text
.env.local
```

Add the following environment variables:

```env
GROQ_API_KEY=your_groq_api_key_here

AUTH_SECRET=your_auth_secret_here

AUTH_GITHUB_ID=your_github_client_id

AUTH_GITHUB_SECRET=your_github_client_secret
```

> ⚠️ Never upload your `.env.local` file or actual API keys and secrets to GitHub.

---

## ▶️ Run the Development Server

Run:

```bash
npm run dev
```

Then open the application in your browser:

```text
http://localhost:3000
```

---

## 🔑 Authentication Setup

This project uses **GitHub OAuth authentication** powered by **NextAuth**.

To configure authentication:

1. Create a GitHub OAuth Application.
2. Add the required callback URL.
3. Copy the GitHub Client ID.
4. Copy the GitHub Client Secret.
5. Add them to your `.env.local` file.

### Local Development Callback URL

```text
http://localhost:3000/api/auth/callback/github
```

---

## 🎯 Project Objective

The goal of **AI Productivity Hub** is to create a centralized platform where users can access multiple AI-powered productivity tools from a single application.

Instead of using separate tools for different tasks, users can:

- Generate blogs
- Chat with AI
- Create business ideas
- Prepare for interviews
- Plan trips
- Build professional resumes
- Analyze resumes
- Generate professional emails
- Organize study schedules

All tools are available through one centralized AI-powered productivity platform.

---

## 🚀 Future Improvements

Planned features and improvements include:

- 📊 Advanced ATS Resume Score
- 🎨 Multiple Resume Templates
- ☁️ Cloud-Based History Storage
- 👤 Advanced User Profiles
- 🔔 Notifications
- 📱 Improved Mobile Responsiveness
- 🎨 Enhanced UI/UX
- ➕ More AI Productivity Tools

---

## 👨‍💻 Developer

**Shivang Vijay**

GitHub:  
https://github.com/shiv06082005

---

## 🔗 Project Links

🌐 **Live Demo:**  
https://ai-productivity-hub-nine.vercel.app/

💻 **GitHub Repository:**  
https://github.com/shiv06082005/ai-productivity-hub

---

## ⭐ Support

If you like this project, please consider giving the repository a **⭐ Star**!

---

## 📄 License

This project is created for **educational and portfolio purposes**.
