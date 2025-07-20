"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  Sun, 
  Moon, 
  Home, 
  Brain, 
  FileText, 
  Settings, 
  User, 
  Search,
  BarChart3,
  MessageSquare,
  Shield,
  Zap
} from "lucide-react"

const LeftNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle theme initialization and persistence
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("hakverse-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)

    if (newMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("hakverse-theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("hakverse-theme", "light")
    }
  }

  const handleNavigation = (href) => {
    navigate(href)
  }

  // Navigation items - only the specific ones requested
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'nextai', label: 'AI Chat', icon: Brain, href: '/nextai' },
    { id: 'nsfw', label: 'NSFW Scanner', icon: Shield, href: '/nsfw' },
    { id: 'file-scanner', label: 'File Scanner', icon: FileText, href: '/file-scanner' },
  ]

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="w-64 h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out relative">
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HakVerse
            </h1>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="relative w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:bg-gray-300 dark:hover:bg-gray-600 group"
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white dark:bg-gray-200 rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center ${
                darkMode ? "translate-x-5" : "translate-x-0"
              }`}
            >
              {darkMode ? <Moon className="w-2.5 h-2.5 text-gray-600" /> : <Sun className="w-2.5 h-2.5 text-yellow-500" />}
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="relative z-10 flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  location.pathname === item.href
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                } justify-start`}
              >
                {/* Active indicator */}
                {location.pathname === item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl animate-pulse"></div>
                )}
                
                <Icon className={`w-5 h-5 mr-3 relative z-10 transition-transform duration-200 ${location.pathname === item.href ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span className="relative z-10 truncate">{item.label}</span>

                {/* Hover effect */}
                {location.pathname !== item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/5 group-hover:to-purple-600/5 rounded-xl transition-all duration-200"></div>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Mobile overlay */}
      <div className="lg:hidden absolute inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-sm"></div>
    </div>
  )
}

export default LeftNav
