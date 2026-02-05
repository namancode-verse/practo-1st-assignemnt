# Contact Management App

A full-stack contact management application built with React and Node.js that allows users to manage their personal contacts with features like favorites, tags, search, and filtering.

## ✨ Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Contact Management**: Add, edit, view, and delete contacts
- **Favorites**: Mark important contacts as favorites
- **Tags/Groups**: Organize contacts using custom tags
- **Search**: Search contacts by name, email, phone, or tags
- **Filter**: Filter contacts by favorites or specific tags
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Validation**: Form validation with user-friendly error messages

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router DOM (routing)
- Axios (HTTP client)
- React Toastify (notifications)
- React Icons
- Vite (build tool)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (authentication)
- bcryptjs (password hashing)

## 📁 Project Structure

```
contact-manager-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── server/                 # Backend Node.js application
│   ├── auth.js            # Authentication logic
│   ├── contacts.js        # Contact CRUD operations
│   ├── models.js          # MongoDB schemas
│   ├── server.js          # Express server setup
│   └── package.json
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/contact-manager
   JWT_SECRET=your-secret-key-here
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📊 Database Structure

### User Schema

| Field    | Type   | Description              |
|----------|--------|--------------------------|
| _id      | ObjectId | Unique identifier      |
| name     | String | User's full name         |
| email    | String | Unique email address     |
| password | String | Hashed password          |

### Contact Schema

| Field      | Type     | Description                |
|------------|----------|----------------------------|
| _id        | ObjectId | Unique identifier          |
| userId     | ObjectId | Reference to the user      |
| name       | String   | Contact's name             |
| phone      | String   | Phone number               |
| email      | String   | Email address              |
| notes      | String   | Additional notes           |
| tags       | [String] | Array of tags              |
| isFavorite | Boolean  | Favorite status (default: false) |

## 🔌 API Endpoints

### Authentication

| Method | Endpoint   | Description          | Body                           |
|--------|------------|----------------------|--------------------------------|
| POST   | /register  | Register new user    | { name, email, password }      |
| POST   | /login     | Login user           | { email, password }            |

### Contacts (Protected - Requires JWT Token)

| Method | Endpoint      | Description          | Body                                    |
|--------|---------------|----------------------|-----------------------------------------|
| GET    | /contacts     | Get all contacts     | -                                       |
| POST   | /contacts     | Create new contact   | { name, phone, email, notes, tags, isFavorite } |
| PUT    | /contacts/:id | Update contact       | { name, phone, email, notes, tags, isFavorite } |
| DELETE | /contacts/:id | Delete contact       | -                                       |

### Authentication Header

All protected endpoints require the Authorization header:
```
Authorization: Bearer <token>
```

## 🎨 UI Features

### Login / Register
- Clean, modern design with gradient background
- Form validation with error messages
- Loading states during submission

### Dashboard
- Grid and list view options
- Real-time search functionality
- Filter by favorites or tags
- Contact count statistics
- Responsive design for all screen sizes

### Contact Modal
- Add/edit contact form
- Tag management (add/remove tags)
- Favorite toggle
- Form validation

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- User-specific data isolation

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the production bundle:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the `dist` folder to your preferred hosting service.

### Backend (Heroku/Railway/Render)

1. Ensure environment variables are set in your hosting platform
2. Deploy the server directory

### Environment Variables for Production

**Frontend** (if needed):
```env
VITE_API_URL=https://your-backend-url.com
```

**Backend**:
```env
PORT=5000
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-production-secret-key
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

naman kumar pandit

For references  : 
frontend is deployed on vercel: https://practo-1st-assignemnt.vercel.app/login
backend is deployed on : https://practo-1st-assignemnt.onrender.com/
