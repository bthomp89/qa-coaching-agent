import { useState } from 'react'
import type { ThemeAnalysisResult } from '../types'
import ThemeInfoModal from './ThemeInfoModal'
import FlagModal from './FlagModal'

interface ThemeAnalysisProps {
  result: ThemeAnalysisResult
  loading: boolean
}

function ThemeAnalysis({ result, loading }: ThemeAnalysisProps) {
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [showFlagModal, setShowFlagModal] = useState(false)
  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Theme Analysis</h2>
            <button
              onClick={() => setShowThemeModal(true)}
              className="text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="View theme information"
              title="View theme information"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
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
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
          </div>
        </div>
        <ThemeInfoModal
          isOpen={showThemeModal}
          onClose={() => setShowThemeModal(false)}
        />
        <FlagModal
          isOpen={showFlagModal}
          onClose={() => setShowFlagModal(false)}
        />
      </div>
    )
  }

  const hasThemes = result.coaching_themes && result.coaching_themes.length > 0

  return (
    <>
      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Theme Analysis</h2>
            <button
              onClick={() => setShowThemeModal(true)}
              className="text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="View theme information"
              title="View theme information"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
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
      
      {hasThemes ? (
        <div className="space-y-4">
          {result.coaching_themes.map((theme, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-md p-4 bg-gray-800"
            >
              <h3 className="text-base font-medium text-white mb-2">
                {theme.theme}
              </h3>
              <p className="text-sm text-gray-300">
                {theme.reason}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-600 rounded-md p-6 bg-gray-800">
          <p className="text-gray-400 text-center">
            No recurring theme has been detected.
          </p>
        </div>
      )}
      </div>
      <ThemeInfoModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />
      <FlagModal
        isOpen={showFlagModal}
        onClose={() => setShowFlagModal(false)}
      />
    </>
  )
}

export default ThemeAnalysis
