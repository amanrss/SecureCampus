# SecureCampus - AI-Powered Campus Security Platform

**SecureCampus** is a full-stack, real-time facial recognition security platform designed for educational institutions. It provides a modern, cyber-themed command center for monitoring live camera feeds, managing registered individuals, and receiving instant alerts for persons of interest.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](YOUR_VERCEL_APP_URL_HERE)


---

### Key Features

* **Real-Time Facial Recognition:** Analyzes live video streams to identify registered individuals in real-time.
* **Live Monitoring Dashboard:** A grid view of multiple simulated CCTV feeds for a central command center experience.
* **Watchlist & Critical Alerts:** An admin panel to place individuals on a watchlist with different threat levels ('info' or 'critical').
* **Instant Notifications:** A dual-tiered alert system that shows a pop-up modal and a persistent, campus-wide banner for critical threats, delivered instantly via WebSockets.
* **Full Admin Control:** A dedicated admin panel to register new faces, edit or delete existing individuals, and manage the watchlist.
* **Event Logging:** Automatically logs all recognition events for auditing and review.

---

### Screenshots

<table>
  <tr>
    <td align="center"><strong>Live Feed Command Center</strong></td>
    <td align="center"><strong>Critical Watchlist Alert</strong></td>
  </tr>
  <tr>
    <td><img src="screenshots/live-feed.png" alt="Live Feed Dashboard showing multiple camera streams with recognition status."></td>
    <td><img src="screenshots/critical-alert.png" alt="A pop-up modal showing a critical alert for a banned person detected on camera."></td>
  </tr>
  <tr>
    <td align="center"><strong>Admin Panel</strong></td>
    <td align="center"><strong>Dashboard Overview</strong></td>
  </tr>
  <tr>
    <td><img src="screenshots/admin-panel.png" alt="Admin panel showing tables for all registered faces and current watchlist members."></td>
    <td><img src="screenshots/dashboard.png" alt="The main dashboard with cards for navigating to different features."></td>
  </tr>
</table>

*(**Note:** After you add your images to the `screenshots` folder, you may need to update the filenames in the `src` paths above if you named them differently.)*

---

### Technology Stack

#### Backend
* **Framework:** FastAPI
* **Real-Time Communication:** Socket.IO
* **Database:** MongoDB
* **AI/ML:** InsightFace, ONNX Runtime, OpenCV
* **Deployment:** Docker, Gunicorn, Uvicorn

#### Frontend
* **Framework:** React (with Vite)
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Routing:** React Router
* **State Management:** React Context

---

### Local Development Setup

**Prerequisites:**
* Python 3.11+
* Node.js 18+
* MongoDB installed locally or a free MongoDB Atlas cluster.

#### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file by copying the example
cp .env.example .env
```
Now, edit the `backend/.env` file and add your MongoDB connection string:
`MONGO_URI=mongodb+srv://...`

**To run the backend server:**
```bash
uvicorn app.main:combined_app --reload
```
The backend will be running at `http://localhost:8000`.

#### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env.local file for the backend URL
echo "VITE_API_URL=http://localhost:8000" > .env.local
```

**To run the frontend server:**
```bash
npm run dev
```
The frontend will be running at `http://localhost:5173`.

---

### Deployment

This application is designed for a three-part deployment on free-tier cloud services:

1.  **Database:** **MongoDB Atlas** (Free M0 Tier).
2.  **Backend:** **Render** (Free Web Service with a Persistent Disk for storing registered face images).
3.  **Frontend:** **Vercel** (Free Hobby Tier).
