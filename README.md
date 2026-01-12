# Knowledge Sharing Platform

A full-stack web application for sharing knowledge, asking questions, and getting answers. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Tech Stack

- **Frontend**: React, Redux Toolkit, Bootstrap, Vite
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT

## Features

- User Authentication (Login/Register)
- Ask Questions with Markdown support
- Answer Questions and Comment
- Upvote/Downvote system
- User Profiles and Reputation
- Search functionality

## Setup Instructions

1. **Clone the repository**
2. **Install Dependencies**
   - Backend: `cd backend && npm install`
   - Client: `cd client && npm install`
3. **Environment Variables**
   - Create `.env` in `backend` with:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/ksp
     JWT_SECRET=your_secret_key
     ```
4. **Run Application**
   - Backend: `npm run dev` (in `backend` folder)
   - Client: `npm run dev` (in `client` folder)
# Harshil_KSP
