"use client"

import { useState, useEffect } from "react"
import { Input, Button } from "@nextui-org/react"
import { Upload, Sparkles, Bot } from "lucide-react"
import { FaBolt } from "react-icons/fa6"
import { IoSend } from "react-icons/io5"
import Markdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import axios from "axios"

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000', // Use direct URL instead of env variable for now
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const NextAI = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState([{ text: "Hey there!", type: "received" }])
  const [inputValue, setInputValue] = useState("")
  const [typing, setTyping] = useState(false)
  const [serverCmd, setServerCmd] = useState("none")

  // No need for HTTPS setup anymore
  const [scanBtnDisabled, setScanBtnDisabled] = useState(false)
  const [scanBtnTxt, setScanBtnTxt] = useState("Scan")
  const [file, setFile] = useState(null)

  // Handle theme initialization
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleServerCmd = (cmd) => {
    setServerCmd(cmd)
    if (cmd === "filescan") {
      alert("File Scan!")
    } else if (cmd === "webscan") {
      alert("Web Scan!")
    }
  }

  const handleFileScan = async () => {
    if (!file) {
      alert("Please select a file first")
      return
    }
    const formData = new FormData()
    formData.append("file", file)
    setScanBtnTxt("Scanning")
    setScanBtnDisabled(true)
    
    try {
      const response = await api.post('/scanFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.status !== 200) {
        throw new Error("Network response was not ok")
      }
      const data = response.data
      console.log("File scan successfully", data)
      const receivedMessage = {
        text: data.answer.ai_output,
        type: "received",
        server_cmd: data.answer.server_cmd,
      }
      setScanBtnTxt("Scan")
      setScanBtnDisabled(false)
      setMessages((prevMessages) => [...prevMessages, receivedMessage])
    } catch (error) {
      setScanBtnTxt("Scan Failed")
      setScanBtnDisabled(false)
      console.error("Error sending message:", error)
      alert("There was an issue scanning the file. Please try again.")
    }
  }

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const message = inputValue.trim();
      const userMessage = { text: message, type: "sent" }
      setMessages((prevMessages) => [...prevMessages, userMessage])
      setTyping(true)
      setInputValue("")  // Clear input immediately after sending

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await api.post('/geminiChat', { q: message });

        clearTimeout(timeoutId);

        console.log('Raw response:', response.data); // Debug log

        if (response.status !== 200) {
          throw new Error(`Server error (${response.status}): ${response.data || 'Unknown error'}`);
        }

        console.log('Full response:', response); // More detailed logging
        
        if (!response.data) {
          throw new Error('No response data received');
        }

        // Handle both possible response formats
        const answer = response.data.answer || response.data;
        if (!answer || (!answer.ai_output && !answer.text)) {
          throw new Error('Invalid response format from server');
        }

        const parsed = {
          ai_output: answer.ai_output || answer.text || "No response content",
          server_cmd: answer.server_cmd || "none"
        };

        console.log('Parsed response:', parsed); // Debug log
        handleServerCmd(parsed.server_cmd);
        
        const receivedMessage = {
          text: parsed.ai_output,
          type: "received",
          server_cmd: parsed.server_cmd,
        };
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        let errorText = "Sorry, I encountered an error processing your request. Please try again.";
        
        if (!navigator.onLine) {
          errorText = "You appear to be offline. Please check your internet connection.";
        } else if (error.response) {
          // Server returned an error response
          errorText = `Server error: ${error.response.data || error.message}`;
        } else if (error.request) {
          // Request was made but no response received
          errorText = "No response from server. Please try again.";
        } else {
          // Something else went wrong
          errorText = error.message;
        }
        
        const errorMessage = {
          text: errorText,
          type: "received",
          server_cmd: "none"
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setTyping(false);
      }
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-pink-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative z-10 w-full h-20 flex items-center justify-between p-6 border-b border-white/20 dark:border-slate-800/50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              NextAI
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Online</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 rounded-full">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">AI Assistant</span>
        </div>
      </div>

      {/* Enhanced Chat Body */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300/50 dark:scrollbar-thumb-slate-600/50 scrollbar-track-transparent">
          {messages.map((msg, index) => (
            <div key={index} className={`flex w-full ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
              <div
                className={`relative max-w-[75%] md:max-w-[60%] ${
                  msg.type === "sent"
                    ? "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white rounded-3xl rounded-br-lg shadow-lg shadow-blue-500/25"
                    : "bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 rounded-3xl rounded-bl-lg shadow-xl border border-white/40 dark:border-slate-800/50"
                } p-4 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl group`}
              >
                {/* Message Content */}
                {msg.type === "received" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <Markdown
                      remarkPlugins={[remarkBreaks]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-medium mb-2 text-slate-800 dark:text-slate-200">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-2 text-slate-700 dark:text-slate-300 leading-relaxed">{children}</p>
                        ),
                        code: ({ children }) => (
                          <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {msg.text}
                    </Markdown>
                  </div>
                ) : (
                  <p className="text-white font-medium">{msg.text}</p>
                )}

                {/* File Scan Interface */}
                {msg.server_cmd === "filescan" && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <Input
                          radius="lg"
                          variant="bordered"
                          type="file"
                          onChange={handleFileChange}
                          classNames={{
                            input: "text-slate-700 dark:text-slate-300",
                            inputWrapper: "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600",
                          }}
                          startContent={<Upload className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />}
                        />
                      </div>
                      <Button
                        radius="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 min-w-[100px]"
                        onClick={handleFileScan}
                        isDisabled={scanBtnDisabled}
                        isLoading={scanBtnDisabled}
                      >
                        {scanBtnTxt}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Enhanced Typing Indicator */}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl rounded-bl-lg p-4 shadow-xl border border-white/40 dark:border-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Input Section */}
        <div className="relative z-10 p-6 border-t border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl">
          <div className="flex items-end gap-4 max-w-4xl mx-auto">
            <div className="flex-1">
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                radius="xl"
                size="lg"
                variant="bordered"
                aria-label="Chat message input"
                classNames={{
                  input: "text-slate-700 dark:text-slate-300 text-base",
                  inputWrapper:
                    "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/40 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 focus-within:border-blue-500 dark:focus-within:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300",
                }}
                startContent={<FaBolt className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
            </div>
            <Button
              radius="xl"
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5 min-w-[60px] h-[56px]"
              onClick={handleSendMessage}
              isDisabled={!inputValue.trim()}
            >
              <IoSend className="w-5 h-5" />
            </Button>
          </div>

          {/* Input Helper Text */}
          <div className="flex justify-center mt-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NextAI
