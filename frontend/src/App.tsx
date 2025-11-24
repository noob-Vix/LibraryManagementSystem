import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUpUser from './pages/SignUpUser'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import { Layout } from './components/ui/Layout'

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
              
              {/* App Name / Hero */}
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                LibraSphere
              </h1>
              <p className="mt-2 text-gray-600 max-w-md">
                “Your gateway to knowledge, one book at a time.”
              </p>

              {/* Hero Image / Icon */}
              <div className="mt-4">
                <img
                  src="https://img.icons8.com/ios-filled/100/000000/books.png"
                  alt="Library"
                  className="mx-auto"
                />
              </div>

              {/* Call to Action Buttons */}
              <div className="mt-6 flex gap-4">
                <Link
                  to="/signin"
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-xl border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 transition"
                >
                  Create Account
                </Link>
              </div>

              {/* Feature Highlights */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full text-center">
                <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                  <h3 className="font-semibold mb-2">Search Books</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Quickly find your favorite books by title, author, or ISBN.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                  <h3 className="font-semibold mb-2">Borrow Easily</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Borrow books with just a few clicks and track due dates effortlessly.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                  <h3 className="font-semibold mb-2">Explore & Discover</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Discover new books, explore categories, and expand your knowledge.
                  </p>
                </div>
              </div>

            </div>
          }
        />


        {/* Auth Pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUpUser />} />

        {/* Role-Based Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireRole={'ADMIN'}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute requireRole={'USER'}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
