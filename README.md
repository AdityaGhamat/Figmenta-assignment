# Bookmark Manager

A full-stack web application to manage bookmarks with a REST API backend and a modern React frontend. Built for the Figmenta Technical Screening.

## 🚀 Features

- **CRUD Operations:** Create, Read, Update, and Delete bookmarks.
- **Tag Filtering:** Filter bookmarks by clicking on tags.
- **Search:** Real-time search by title or URL.
- **Responsive UI:** Built with Tailwind CSS v4 for a modern, mobile-friendly design.
- **RESTful API:** A separate backend service handling data operations.

## 🛠 Tech Stack

**Frontend:**

- React (Vite)
- TypeScript
- Tailwind CSS v4
- React Router DOM
- Axios
- Lucide React (Icons)

**Backend:**

- Node.js
- Express.js
- TypeScript
- CORS & Body Parser
- In-Memory Data Store (as per brief requirements)

## 📦 Setup & Installation

This project uses a monorepo-style structure with a single command to run both client and server.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd figmenta-bookmark-manager
    ```

2.  **Install Root Dependencies:**

    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**

    ```bash
    cd server
    npm install
    cd ..
    ```

4.  **Install Frontend Dependencies:**
    ```bash
    cd client
    npm install
    cd ..
    ```

## 🏃‍♂️ Running the Application

To start both the backend server and the frontend client simultaneously:

```bash
npm start
```

````

- **Frontend:** Runs on [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
- **Backend API:** Runs on [http://localhost:process.env.PORT || 4000](https://www.google.com/search?q=http://localhost:5000)

## 🤖 AI Tools Used

- **Claude / ChatGPT:** Used for generating initial boilerplate code for the Express server and Tailwind configuration to speed up development.
- **GitHub Copilot:** Used for inline code completion and typing suggestions.

## 📝 Assumptions & Design Choices

1. **Data Persistence:** Per the brief's "Storage" requirements, I utilized an **in-memory array** for simplicity and speed. Data will reset if the server restarts.
2. **Validation:** Basic validation is implemented on both frontend (HTML5 attributes) and backend (API checks for required fields).
3. **Styling:** Tailwind CSS v4 was chosen for rapid UI development and standard utility-first styling.
4. **Concurrent Execution:** The `concurrently` package is used to run both servers with a single command (`npm start`) for a better developer experience.

## ⏱️ Time Spent

- **Total Time:** ~30 minutes
- **Breakdown:**
    - Setup & Config: 5 mins
    - Backend API: 10 mins
    - Frontend UI & Integration: 10 mins
    - Documentation & Deployment: 5 mins

---

_Submitted by Aditya_

```

```
````
