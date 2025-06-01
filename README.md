# 🎓 Wizdom.ai - Real-Time AI-Powered Learning Platform  

Wizdom.ai is a modern LMS SaaS application that powers real-time, interactive teaching sessions using AI. It enables learners to engage in dynamic classrooms with their choice of **topic, style, subject and duration** with communication, session tracking, and intelligent insights. Built with Vapi, Supabase, Next.js, and Clerk, it delivers a scalable, secure, and monitored platform.

---

### ✨ Features  
- **Real-Time AI Teaching**: Host or attend AI-enhanced live sessions with intelligent interactions.  
- **Interactive Classrooms**: Tools to facilitate participation, Q&A, and collaborative learning.  
- **User Management**: Seamless authentication and session control with Clerk.  
- **Reliable Backend**: Scalable and reactive backend powered by Supabase.  
- **Monitoring & Alerts**: Real-time monitoring and error tracking using Sentry.

---

### 🛠 Dependencies  
- AI Audio/Video Layer - [Vapi](https://vapi.ai/)  
- Authentication - [Clerk](https://clerk.com/)  
- Backend and Realtime DB - [Supabase](https://supabase.com/)  
- Web Framework - [Next.js](https://nextjs.org/)  
- Monitoring and Logging - [Sentry](https://sentry.io/)  

---

### 🚀 How to Use  
1. Sign up or log in securely using Clerk.  
2. Create or join a classroom session through the Next.js interface.  
3. Experience real-time AI-powered teaching and interaction via Vapi.  
4. All session data and activity are tracked and stored in Supabase.  
5. Issues and performance are monitored continuously via Sentry.

---

### 🗒️ Set Up Environment Variables

Create a new file named .env in the root of your project and add the following content:

# Sentry
SENTRY_AUTH_TOKEN=

# Vapi
NEXT_PUBLIC_VAPI_WEB_TOKEN=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

#### 🏗 Built with ❤️ using Vapi, Supabase, Next.js, Clerk, and Sentry  
