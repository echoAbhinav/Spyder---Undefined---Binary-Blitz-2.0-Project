"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Upload, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Download,
  Eye,
  Trash2,
  Zap,
  Brain,
  Clock,
  FileCheck,
  AlertCircle
} from "lucide-react"

const FileScanner = () => {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    setError(null)
    setScanResult(null)
    setUploadedFile(file)
  }

  const scanFile = async () => {
    if (!uploadedFile) return

    setIsLoading(true)
    setError(null)
    setScanResult(null)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)

      const response = await fetch('http://localhost:3000/scanFile', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setScanResult(data.answer)
    } catch (err) {
      setError(err.message || 'Failed to scan file')
      console.error('Scan error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const clearFile = () => {
    setUploadedFile(null)
    setScanResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'txt': return <FileText className="w-6 h-6" />
      case 'pdf': return <FileText className="w-6 h-6" />
      case 'doc':
      case 'docx': return <FileText className="w-6 h-6" />
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx': return <FileText className="w-6 h-6" />
      case 'py': return <FileText className="w-6 h-6" />
      case 'java': return <FileText className="w-6 h-6" />
      case 'cpp':
      case 'c': return <FileText className="w-6 h-6" />
      default: return <FileText className="w-6 h-6" />
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-violet-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 w-full p-4 border-b border-white/20 dark:border-slate-800/50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-violet-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-violet-700 dark:from-white dark:via-purple-200 dark:to-violet-200 bg-clip-text text-transparent">
                File Scanner
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">AI-Powered Security Analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 rounded-full">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row gap-6 p-6">
          {/* Left Panel - File Upload */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            {/* Upload Area */}
            <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 p-6">
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Upload File</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Drag and drop your file or click to browse. Supports text files, documents, and code files.
                  </p>
                </div>

                {/* Drag & Drop Area */}
                <div
                  className={`flex-1 border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                    dragActive
                      ? 'border-purple-400 bg-purple-50/50 dark:bg-purple-950/20'
                      : 'border-slate-300 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    {!uploadedFile ? (
                      <>
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-full flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                          Drop your file here
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          or click to browse files
                        </p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 font-medium"
                        >
                          Choose File
                        </button>
                      </>
                    ) : (
                      <div className="w-full">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-lg flex items-center justify-center">
                            {getFileIcon(uploadedFile.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                              {uploadedFile.name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {formatFileSize(uploadedFile.size)}
                            </p>
                          </div>
                          <button
                            onClick={clearFile}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInput}
                  className="hidden"
                  accept=".txt,.pdf,.doc,.docx,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c"
                />

                {/* Scan Button */}
                {uploadedFile && (
                  <div className="mt-6">
                    <button
                      onClick={scanFile}
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Scanning File...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Scan File
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            {/* Results Area */}
            <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-800/50 p-6">
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Analysis Results</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    AI-powered security analysis and insights
                  </p>
                </div>

                <div className="flex-1">
                  {isLoading && (
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                        <Brain className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div className="text-center">
                        <p className="text-slate-700 dark:text-slate-300 font-semibold text-lg mb-2">
                          Analyzing File
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          AI is scanning for security threats and vulnerabilities...
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                        <XCircle className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        Scan Failed
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4">
                        {error}
                      </p>
                      <button
                        onClick={scanFile}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {scanResult && !isLoading && !error && (
                    <div className="space-y-6">
                      {/* AI Output */}
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/30">
                        <div className="flex items-center gap-2 mb-3">
                          <Brain className="w-5 h-5 text-emerald-600" />
                          <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">AI Analysis</h3>
                        </div>
                        <div className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                          {scanResult.ai_output}
                        </div>
                      </div>

                      {/* Server Commands */}
                      {scanResult.server_cmd && scanResult.server_cmd !== "none" && (
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl p-4 border border-orange-200 dark:border-orange-800/30">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            <h3 className="font-semibold text-orange-800 dark:text-orange-200">Detected Commands</h3>
                          </div>
                          <div className="bg-slate-800 text-slate-200 rounded-lg p-3 font-mono text-sm overflow-x-auto">
                            {scanResult.server_cmd}
                          </div>
                        </div>
                      )}

                      {/* Status Summary */}
                      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">Analysis Complete</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            File has been thoroughly scanned
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!scanResult && !isLoading && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <FileCheck className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        Ready to Scan
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Upload a file to begin AI-powered security analysis
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-10 p-3 border-t border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                <span>AI-Powered Analysis</span>
              </div>
              <span>•</span>
              <span>Hakverse AI • File Scanner v2.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileScanner 