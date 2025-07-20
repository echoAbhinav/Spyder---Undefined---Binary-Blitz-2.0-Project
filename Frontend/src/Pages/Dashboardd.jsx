"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Bot, FileScan, Globe, Shield, Sun, Moon, Sparkles, ChevronDown } from "lucide-react"

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()

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

  const features = [
    {
      title: "AI Chat",
      description: "Intelligent conversations with advanced AI assistance for seamless productivity",
      icon: <Bot size={28} />,
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      bgGradient: "from-blue-50/80 via-indigo-50/60 to-blue-100/40",
      darkBgGradient: "from-blue-950/30 via-indigo-950/20 to-blue-900/10",
      shadowColor: "shadow-blue-500/20",
      route: "/nextai",
    },
    {
      title: "File Scanner",
      description: "Advanced file analysis with AI-powered security scanning and threat detection",
      icon: <FileScan size={28} />,
      gradient: "from-purple-500 via-violet-600 to-purple-700",
      bgGradient: "from-purple-50/80 via-violet-50/60 to-purple-100/40",
      darkBgGradient: "from-purple-950/30 via-violet-950/20 to-purple-900/10",
      shadowColor: "shadow-purple-500/20",
      route: "/file-scanner",
    },
    {
      title: "Web Analyzer",
      description: "Comprehensive website analysis with performance insights and optimization tips",
      icon: <Globe size={28} />,
      gradient: "from-emerald-500 via-teal-600 to-cyan-600",
      bgGradient: "from-emerald-50/80 via-teal-50/60 to-cyan-100/40",
      darkBgGradient: "from-emerald-950/30 via-teal-950/20 to-cyan-900/10",
      shadowColor: "shadow-emerald-500/20",
      route: "/web-analyzer",
    },
    {
      title: "NSFW Detector",
      description: "Advanced content moderation with real-time safety protection and filtering",
      icon: <Shield size={28} />,
      gradient: "from-orange-500 via-red-500 to-pink-600",
      bgGradient: "from-orange-50/80 via-red-50/60 to-pink-100/40",
      darkBgGradient: "from-orange-950/30 via-red-950/20 to-pink-900/10",
      shadowColor: "shadow-orange-500/20",
      route: "/nsfw",
    },
  ]

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-all duration-500 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-pink-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Hakverse
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">AI Dashboard</p>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 hover:bg-gray-300 dark:hover:bg-gray-600 group"
            >
              <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white dark:bg-gray-200 rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center group-hover:scale-105 ${
                  darkMode ? "translate-x-7" : "translate-x-0"
                }`}
              >
                {darkMode ? (
                  <Moon className="w-3.5 h-3.5 text-gray-700" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-yellow-500" />
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              AI-Powered Platform
            </div>

            <h2 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-gray-900 dark:text-white">Next-Gen</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Tools
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your workflow with our comprehensive suite of intelligent tools designed for the modern digital
              landscape
            </p>

            <div className="flex justify-center mt-8">
              <ChevronDown className="w-6 h-6 text-gray-400 animate-bounce" />
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                onClick={() => navigate(feature.route)}
                className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 hover:border-gray-300/50 dark:hover:border-gray-700/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} dark:bg-gradient-to-br dark:${feature.darkBgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500`}
                ></div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10 space-y-6">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg ${feature.shadowColor} group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}
                  >
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{feature.description}</p>

                  {/* Hover Action */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Launch Tool
                      <svg
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl rounded-3xl p-12 border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Trusted by Professionals</h3>
              <p className="text-gray-600 dark:text-gray-400">Join thousands of users who rely on Hakverse daily</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300">
                  99.9%
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Accuracy Rate</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300">
                  2.5M+
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Files Processed</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="text-center">
            <button 
              onClick={() => navigate("/nextai")}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 hover:scale-105">
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Start Your Journey
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
