"use client"

import { useState, useEffect } from "react"
import { Shield, Eye, Video, Maximize2, Activity } from "lucide-react"

const NSFW = () => {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simulate loading time for iframe
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/10 to-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Compact Header */}
      <div className="relative z-10 w-full p-2 border-b border-white/20 dark:border-slate-800/50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-slate-800 via-orange-700 to-red-700 dark:from-white dark:via-orange-200 dark:to-red-200 bg-clip-text text-transparent">
                NSFW Detector
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 rounded-full">
              <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Live Detection</span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Enhanced Iframe Container - Full Height */}
          <div className={`relative group flex-1 ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
            {isFullscreen && <div className="absolute inset-0 bg-black/95 backdrop-blur-sm"></div>}

            {/* Main iframe container */}
            <div
              className={`relative h-full overflow-hidden ${
                isFullscreen
                  ? "relative z-10 m-4 rounded-2xl"
                  : "bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-x border-white/50 dark:border-slate-800/50"
              }`}
            >
              {/* Minimal browser header for fullscreen */}
              {isFullscreen && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-xl rounded-lg p-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-1 hover:bg-white/20 rounded transition-colors text-white"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                      <Video className="w-8 h-8 text-orange-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg">Loading NSFW Detector</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Initializing AI detection system...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* The actual iframe - Full container */}
              <iframe
                src="https://nsfw-detector-01y2.onrender.com/video.html"
                className="w-full h-full border-0 block"
                title="NSFW Detector - Real-time Video Analysis"
                allow="camera; microphone; fullscreen; autoplay; display-capture; web-share"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-downloads allow-modals"
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                style={{
                  backgroundColor: "#ffffff",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  height: "100%",
                  minHeight: "100%",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      

      {/* Bottom Status Bar - Minimal */}
      {!isFullscreen && (
        <div className="relative z-10 p-2 border-t border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Privacy Protected</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>Real-time Analysis</span>
                </div>
                <span>•</span>
                <span>Hakverse AI • NSFW Detection v2.1</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NSFW
