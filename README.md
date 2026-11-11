# 🎵 Spotify Backend API

A robust RESTful backend API for a Spotify clone built with **Node.js**, **Express**, and **MongoDB**. It features **Role-Based Access Control (RBAC)**, secure **JWT cookie-based authentication**, **cloud media streaming and storage via ImageKit**, and complete relational data modeling for artists, songs, and albums.

---

## 🚀 Key Features

- **Authentication & Authorization**:
  - Secure user registration and login with **bcryptjs** password hashing.
  - Stateless authentication using **JSON Web Tokens (JWT)** delivered via HTTP cookies.
  - **Role-Based Access Control (RBAC)** supporting two roles: `user` (listeners) and `artist` (creators).
  - Middleware-based route protection (`authartist` and `authuser`).

- **Music & Track Management**:
  - Upload audio tracks (`.mp3`, etc.) alongside cover art (`.png`, `.jpg`, etc.) using **Multer**.
  - Direct integration with **ImageKit CDN** for media streaming and asset hosting.
  - Links uploaded tracks directly to the authenticated artist's profile in MongoDB.

- **Album Organization**:
  - Group multiple song tracks under an album with dedicated album cover artwork.
  - Supports multiple input formats for track ObjectIds (JSON array, comma-separated, or repeated form-data keys).

- **Music Discovery & Population**:
  - Retrieve and explore tracks with Mongoose document population (resolving artist username and email).

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Server-side JavaScript runtime environment |
| **Express.js (v5)** | Fast, minimalist web framework for REST API routing |
| **MongoDB & Mongoose (v9)** | NoSQL database and Object Data Modeling (ODM) library |
| **JSON Web Tokens (JWT)** | Token-based authentication and authorization |
| **bcryptjs** | Password salting and hashing |
| **Multer** | Multipart/form-data middleware for handling file uploads in memory |
| **ImageKit SDK (`@imagekit/nodejs`)** | Cloud storage and CDN optimization for audio and image assets |
| **cookie-parser** | Parsing HTTP request cookies for token verification |
| **dotenv** | Managing sensitive configuration and environment variables |

---

## 📁 Project Structure

```text
spotify/
├── .env.example              # Template for environment variables
├── .gitignore                # Git ignore rules for node_modules, secrets, etc.
├── package.json              # Project dependencies and metadata
├── server.js                 # Application entry point & DB connection initialization
└── src/
    ├── app.js                # Express app setup, middlewares, and route mounting
    ├── controllers/
    │   ├── auth-controller.js   # Handles registration, login, and logout
    │   └── music-controller.js  # Handles song upload, album creation, and fetching
    ├── db/
    │   └── db.js             # MongoDB connection logic via Mongoose
    ├── middlewares/
    │   └── auth-middleware.js # RBAC protection middlewares (authartist, authuser)
    ├── models/
    │   ├── album-model.js    # Mongoose schema for albums
    │   ├── music-model.js    # Mongoose schema for songs
    │   └── user-model.js     # Mongoose schema for users and roles
    ├── routes/
    │   ├── auth-routes.js    # Auth endpoint definitions (/api/auth)
    │   └── music-routes.js   # Music & Album endpoint definitions (/api/music)
    └── services/
        └── storage.js        # ImageKit cloud upload helper functions
```

---

## 🗄️ Database Models

### 1. User (`user`)
- `username`: String, unique, required
- `email`: String, unique, required
- `password`: String (bcrypt hash), required
- `role`: String enum (`"user"`, `"artist"`), defaults to `"user"`

### 2. Song (`songs`)
- `title`: String, required
- `song`: String (ImageKit audio file URL), required
- `image`: String (ImageKit cover artwork URL), required
- `artist`: ObjectId referencing the `user` model, required

### 3. Album (`album`)
- `title`: String, required
- `image`: String (ImageKit album artwork URL), required
- `musics`: Array of ObjectIds referencing the `songs` model, required
- `artist`: ObjectId referencing the `user` model, required

---

## 🔌 API Reference

### Base URL: `http://localhost:3000`

### 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user or artist |
| `POST` | `/api/auth/login` | Public | Login with email/username and password |
| `POST` | `/api/auth/logout` | Authenticated | Clears the auth cookie |

#### Register Payload (`application/json`):
```json
{
  "username": "john_artist",
  "email": "john@example.com",
  "password": "secretpassword",
  "role": "artist" 
}
```
*(Note: `role` defaults to `"user"` if not specified; set to `"artist"` to upload songs and albums).*

---

### 2. Music & Album Endpoints (`/api/music`)

| Method | Endpoint | Access | Request Type | Description |
|---|---|---|---|---|
| `POST` | `/api/music/upload` | Artist Only | `multipart/form-data` | Upload a new track and its artwork |
| `POST` | `/api/music/album` | Artist Only | `multipart/form-data` | Create a new album with selected song IDs |
| `GET` | `/api/music/` | User / Artist | None | Fetch songs with populated artist info |

#### Track Upload (`POST /api/music/upload` - `multipart/form-data`):
- `title` (Text): Song title
- `music` (File): Audio file (e.g. `track.mp3`)
- `image` (File): Track artwork image (e.g. `cover.jpg`)

#### Album Creation (`POST /api/music/album` - `multipart/form-data`):
- `title` (Text): Album title
- `image` (File): Album cover image
- `musics` (Text): JSON array of song ObjectIds, e.g. `["6730c4e789f2a41234567890", "6730c4e789f2a41234567891"]`

---

## ⚙️ Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance
- [ImageKit.io](https://imagekit.io/) account for media uploads

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd spotify
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Open `.env` and fill in your credentials:
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/spotify
JWT_SECRET=your_super_secret_jwt_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

### 4. Start the Application
```bash
node server.js
```
The server will start on `http://localhost:3000` and connect to MongoDB.

---

## 🔒 Security Best Practices Implemented

- **Password Hashing**: Passwords are salted and hashed using `bcryptjs` before persisting to MongoDB.
- **Environment Isolation**: Secret keys (`JWT_SECRET`, `IMAGEKIT_PRIVATE_KEY`, and database credentials) are stored strictly in `.env` and kept out of version control via `.gitignore`.
- **Role Verification**: Critical endpoints verify the requester's role in the signed JWT token before processing uploads.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).

