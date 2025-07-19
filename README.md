# Taylance CRM

**Taylance CRM** is a modern, full-featured Customer Relationship Management system built using the MERN stack (MongoDB, Express, React, Node.js). It helps teams track leads, manage clients, assign tasks, and streamline communication — all through a beautifully designed, responsive interface.

![Taylance CRM UI Preview](taylancecrm.vercel.app)

---

## Features

- ✅ JWT Authentication with Access & Refresh Tokens
- 👤 Role-Based Access (Admin, Member)
- 📋 Leads & Client Management
- 📈 Analytics Dashboard
- 🌙 Dark Mode UI
- 🧩 Modular, Scalable Architecture

---

## Tech Stack

### Frontend
- React.js (Vite)
- Material UI (MUI)
- Axios
- React Router
- Framer Motion (for animation)
- Context API & Custom Hooks

### Backend (Separate Repo)
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- Multer (for file uploads)

---

## Repositories

| Layer      | Repository                                               |
|------------|----------------------------------------------------------|
| Frontend   | [CRM-Frontend](https://github.com/thisistayyab/CRM-Frontend) |
| Backend    | [CRM-Backend](https://github.com/thisistayyab/CRM-Backend) |

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas Account
- Vite (optional, will auto-install)

---

### Frontend Setup

```bash
git clone https://github.com/thisistayyab/CRM-Frontend.git
cd CRM-Frontend
npm install
npm run dev
```

### Backend Setup
```bash
git clone https://github.com/thisistayyab/CRM-Backend.git
cd CRM-Backend
npm install
```
### .env file
# ====== Server Settings ======
PORT=5000
# The port your Express server runs on.

# ====== Database (MongoDB Atlas) ======
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taylance-crm?retryWrites=true&w=majority
# MongoDB connection string

# ====== JWT Authentication ======
ACCESS_TOKEN_SECRET=your_access_token_secret_key
ACCESS_TOKEN_EXPIRY=15m
# Short-lived token (e.g., 15m, 30m)

REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
REFRESH_TOKEN_EXPIRY=7d
# Long-lived refresh token (e.g., 7d, 30d)

# ====== Email (SMTP Configuration) ======
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
SMTP_FROM=Taylance CRM <your_email@example.com>
# For sending verification/reset password emails

# ====== Redis (Optional for session/cache/token storage) ======
REDIS_URL=redis://default:<password>@<host>:<port>
# Example: redis://default:1234abcd@redis-12345.c12.us-east-1-2.ec2.cloud.redislabs.com:12345

# ====== Cloudinary (Image/File Uploads) ======
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

### License
This project is licensed under the MIT License
