'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Prevent multiple error logs
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (e) => {
        e.preventDefault()
        console.warn('Prevented error from bubbling:', e.error)
      })
      
      window.addEventListener('unhandledrejection', (e) => {
        e.preventDefault()
        console.warn('Prevented unhandled promise rejection:', e.reason)
      })
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[#F7DD0F]">Something went wrong!</h1>
              <p className="text-gray-400">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>
            
            <button
              onClick={this.resetError}
              className="w-full bg-[#F7DD0F] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#F7DD0F]/90 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}