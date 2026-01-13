import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Sun, Moon, Languages, LogOut, User, Menu, X, Type, FileDiff, History as HistoryIcon } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { t, i18n } = useTranslation()
  const { isAuthenticated, user, logout } = useAuth()
  const { isDark, setTheme } = useTheme()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: '/counter', label: t('nav.counter', '文字数カウント'), icon: Type },
    { path: '/diff', label: t('nav.diff', '差分比較'), icon: FileDiff },
    { path: '/history', label: t('nav.history', '履歴'), icon: HistoryIcon },
  ]

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ja' ? 'en' : 'ja'
    i18n.changeLanguage(newLang)
  }

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-primary-700 transition-colors">
              TF
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              TextFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-1"
              aria-label="Toggle language"
            >
              <Languages size={20} />
              <span className="text-xs font-semibold">{i18n.language.toUpperCase()}</span>
            </button>

            {/* Auth */}
            <div className="pl-2 border-l border-gray-200 dark:border-gray-700 ml-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                   <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                     <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400">
                       <User size={16} />
                     </div>
                     <span className="font-medium hidden lg:inline">{user?.username}</span>
                   </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-full text-gray-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                    title={t('common.logout', 'ログアウト')}
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {t('common.login', 'ログイン')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-full text-sm font-medium bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow transition-all duration-200"
                  >
                    {t('common.register', '新規登録')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
               onClick={() => setIsMenuOpen(!isMenuOpen)}
               className="p-2 rounded-md text-gray-600 dark:text-gray-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-3 rounded-lg text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4 flex justify-between items-center px-2">
               <div className="flex items-center space-x-4">
                 <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                   {isDark ? <Sun size={20} /> : <Moon size={20} />}
                 </button>
                 <button onClick={toggleLanguage} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center space-x-1">
                   <Languages size={20} />
                   <span className="text-xs font-bold">{i18n.language.toUpperCase()}</span>
                 </button>
               </div>
               {!isAuthenticated && (
                <div className="flex items-center space-x-3">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-gray-600">Login</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-medium">Register</Link>
                </div>
               )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
