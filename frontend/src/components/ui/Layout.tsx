import React from 'react'
import {Link} from 'react-router-dom'
import {useAuth} from '../../context/AuthContext'
import {useTheme} from '../../context/ThemeContext'

export const Layout: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const auth = useAuth()
  const {theme, toggleTheme} = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">LibraSphere</Link>
          <nav className="flex items-center space-x-3">
            {!auth.user ? (
              <>
                <Link to="/signin">Sign In</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            ) : (
              <>
                {auth.user.role === 'ADMIN' ? <Link to="/admin">Dashboard</Link> : <Link to="/user">My Books</Link>}
                <button onClick={() => auth.logout()} className="ml-3 text-sm text-red-600">Sign out</button>
              </>
            )}
            <button onClick={toggleTheme} className="ml-3 text-sm px-2 py-1 rounded border dark:border-slate-700 dark:bg-slate-800">{theme === 'light' ? '🌙' : '☀️'}</button>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}

export default Layout
