# JobFinder - Dynamic Job Board Web App

A modern, responsive job board application built with React, Firebase, and Bootstrap. JobFinder connects job seekers with employers through an intuitive and feature-rich platform.

## 🚀 Features

### Core Features

-   **Responsive Job Listings** - Browse jobs in grid/list layout with smart filtering
-   **Advanced Search & Filters** - Search by title, company, location, job type, and salary range
-   **Job Detail Pages** - Comprehensive job information with dynamic routing
-   **Post Job Form** - Easy job posting for employers with form validation
-   **User Authentication** - Secure login/register system with Firebase Auth
-   **Mobile-First Design** - Fully responsive interface using Bootstrap 5

### Technical Features

-   **Real-time Data** - Firebase Firestore for live job updates
-   **State Management** - React Context API for global state
-   **Route Protection** - Secure routes for authenticated users
-   **Form Validation** - Client-side validation with helpful error messages
-   **Loading States** - Smooth loading indicators and error handling
-   **SEO Friendly** - Semantic HTML and proper meta tags

## 🛠 Tech Stack

-   **Frontend**: React 18 (Functional Components + Hooks)
-   **Routing**: React Router DOM
-   **Styling**: Bootstrap 5 + Custom CSS
-   **Icons**: Font Awesome
-   **Backend**: Firebase (Firestore, Auth, Storage)
-   **Build Tool**: Vite
-   **State Management**: React Context API

## 🔧 Installation & Setup

### Prerequisites

-   Node.js (version 16 or higher)
-   npm or yarn
-   Firebase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd zaposlitev-si
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database, Authentication, and Storage
3. Create a web app and copy the configuration
4. Update `src/services/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: 'your-api-key',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '123456789',
    appId: 'your-app-id',
};
```

### 4. Firestore Security Rules

Set up these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Jobs collection
    match /jobs/{jobId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == get(/databases/$(database)/documents/jobs/$(jobId)).data.postedBy;
      allow delete: if request.auth != null && request.auth.uid == get(/databases/$(database)/documents/jobs/$(jobId)).data.postedBy;
    }

    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 Usage

### For Job Seekers

1. **Browse Jobs** - Visit the homepage to see all available jobs
2. **Filter & Search** - Use the filter panel to narrow down results
3. **View Details** - Click on any job card to see full details
4. **Apply** - Click "Apply Now" to submit applications (demo feature)

### For Employers

1. **Register/Login** - Create an account to post jobs
2. **Post Jobs** - Use the "Post a Job" form to add new positions
3. **Manage Listings** - Edit or delete your posted jobs

### Key Features

-   **Real-time Updates** - Jobs appear immediately after posting
-   **Smart Filtering** - Multiple filter options work together
-   **Mobile Responsive** - Works seamlessly on all devices
-   **User Authentication** - Secure login system

## 🔐 Firebase Collections

### Jobs Collection (`jobs`)

```javascript
{
  id: "auto-generated",
  title: "Senior Frontend Developer",
  company: "Tech Corp",
  location: "New York, NY",
  jobType: "full-time",
  salary: 85000,
  description: "Job description...",
  requirements: "Requirements...",
  benefits: "Benefits...",
  companyDescription: "About the company...",
  companyWebsite: "https://company.com",
  postedBy: "user-uid",
  postedByEmail: "user@email.com",
  status: "active",
  createdAt: Firebase Timestamp,
  updatedAt: Firebase Timestamp
}
```

### Users Collection (`users`)

```javascript
{
  uid: "firebase-user-uid",
  email: "user@email.com",
  displayName: "John Doe",
  firstName: "John",
  lastName: "Doe",
  createdAt: Firebase Timestamp,
  updatedAt: Firebase Timestamp
}
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using React, Firebase, and Bootstrap+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
