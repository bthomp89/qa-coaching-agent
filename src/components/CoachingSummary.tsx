import { useState } from 'react'
import FlagModal from './FlagModal'

// Helper function to parse coaching summary into summary paragraph and improvement bullet points
function parseCoachingSummary(text: string): { summaryParagraph: string; improvementPoints: string[] } {
  if (!text) return { summaryParagraph: '', improvementPoints: [] }
  
  // Split by newlines
  const lines = text.split(/\n/).map(line => line.trim()).filter(line => line.length > 0)
  
  // Pattern to match bullet points at the start of a line: •, -, *, or numbered (1., 2., etc.)
  const bulletPattern = /^[•\-\*]\s+|^\d+\.\s+/
  
  let summaryLines: string[] = []
  let improvementPoints: string[] = []
  let foundFirstBullet = false
  
  for (const line of lines) {
    // Check if line starts with a bullet marker
    if (bulletPattern.test(line)) {
      foundFirstBullet = true
      // Extract the content after the bullet marker
      const content = line.replace(bulletPattern, '').trim()
      if (content) {
        improvementPoints.push(content)
      }
    } else if (line.includes('•') || line.includes('- ') || line.includes('* ')) {
      // Line contains bullet markers but not at start, try to split by them
      foundFirstBullet = true
      const parts = line.split(/[•\-\*]\s+/).filter(p => p.trim().length > 0)
      improvementPoints.push(...parts)
    } else {
      if (foundFirstBullet) {
        // Continue previous bullet point (append to last item)
        if (improvementPoints.length > 0) {
          improvementPoints[improvementPoints.length - 1] += ' ' + line
        }
      } else {
        // Still in summary paragraph section
        summaryLines.push(line)
      }
    }
  }
  
  const summaryParagraph = summaryLines.join(' ').trim()
  const filteredImprovementPoints = improvementPoints.filter(item => item.trim().length > 0)
  
  return {
    summaryParagraph,
    improvementPoints: filteredImprovementPoints
  }
}

interface CoachingSummaryProps {
  summary: string | null
  loading: boolean
}

function CoachingSummary({ summary, loading }: CoachingSummaryProps) {
  const [showFlagModal, setShowFlagModal] = useState(false)

  if (loading) {
    return (
      <>
        <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Coaching Summary</h2>
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

  const { summaryParagraph, improvementPoints } = parseCoachingSummary(summary)

  return (
    <>
      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Coaching Summary</h2>
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
      
      {summaryParagraph && (
        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          {summaryParagraph}
        </p>
      )}
      
      {improvementPoints.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-200 mb-2">Areas for Improvement</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
            {improvementPoints.map((point, index) => (
              <li key={index}>{point.trim()}</li>
            ))}
          </ul>
        </div>
      )}
      </div>
      <FlagModal
        isOpen={showFlagModal}
        onClose={() => setShowFlagModal(false)}
      />
    </>
  )
}

export default CoachingSummary
