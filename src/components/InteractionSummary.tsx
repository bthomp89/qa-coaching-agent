import { useState } from 'react'
import FlagModal from './FlagModal'

interface InteractionSummaryProps {
  summary: string | null
  loading: boolean
}

function InteractionSummary({ summary, loading }: InteractionSummaryProps) {
  const [showFlagModal, setShowFlagModal] = useState(false)
  if (loading) {
    return (
      <>
        <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6 animate-pulse relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Interaction Summary</h2>
            <button
              onClick={() => setShowFlagModal(true)}
              className="text-amber-500 hover:text-amber-400 transition-colors"
              aria-label="Flag content"
              title="Flag content"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
        <FlagModal
          isOpen={showFlagModal}
          onClose={() => setShowFlagModal(false)}
        />
      </>
    )
  }

  if (!summary) {
    return null
  }

  return (
    <>
      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Interaction Summary</h2>
          <button
            onClick={() => setShowFlagModal(true)}
            className="text-amber-500 hover:text-amber-400 transition-colors"
            aria-label="Flag content"
            title="Flag content"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
          {summary}
        </p>
      </div>
      <FlagModal
        isOpen={showFlagModal}
        onClose={() => setShowFlagModal(false)}
      />
    </>
  )
}

export default InteractionSummary
