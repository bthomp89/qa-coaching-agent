import { useState } from 'react'
import type { QAResult } from '../types'
import { RUBRICS, formatCriterionName } from '../constants/rubrics'
import RubricModal from './RubricModal'
import FlagModal from './FlagModal'

interface OutputPanelProps {
  loading: boolean
  error: string | null
  result: QAResult | null
}

// Helper function to format text with bullet points
function formatBulletPoints(text: string): string[] {
  if (!text) return []
  
  // Split by newlines first
  const lines = text.split(/\n/).map(line => line.trim()).filter(line => line.length > 0)
  
  // Pattern to match bullet points at the start of a line: •, -, *, or numbered (1., 2., etc.)
  const bulletPattern = /^[•\-\*]\s+|^\d+\.\s+/
  
  const result: string[] = []
  
  for (const line of lines) {
    // Check if line starts with a bullet marker
    if (bulletPattern.test(line)) {
      // Extract the content after the bullet marker
      const content = line.replace(bulletPattern, '').trim()
      if (content) {
        result.push(content)
      }
    } else if (line.includes('•') || line.includes('- ') || line.includes('* ')) {
      // Line contains bullet markers but not at start, try to split by them
      const parts = line.split(/[•\-\*]\s+/).filter(p => p.trim().length > 0)
      result.push(...parts)
    } else if (result.length === 0) {
      // First line without bullets, treat as single item
      result.push(line)
    } else {
      // Continue previous bullet point (append to last item)
      result[result.length - 1] += ' ' + line
    }
  }
  
  return result.filter(item => item.trim().length > 0)
}

function OutputPanel({ loading, error, result }: OutputPanelProps) {
  const [selectedCriterion, setSelectedCriterion] = useState<string | null>(null)
  const [showFlagModal, setShowFlagModal] = useState(false)
  
  // Calculate overall score from criteria scores
  const calculateOverallScore = (criteria: QAResult['criteria']): number => {
    const scores = Object.values(criteria).map(c => c.score)
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
    return Math.round(average * 10) / 10 // Round to 1 decimal
  }

  const handleOpenRubric = (criterion: string) => {
    setSelectedCriterion(criterion)
  }

  const handleCloseRubric = () => {
    setSelectedCriterion(null)
  }

  const selectedRubric = selectedCriterion ? RUBRICS[selectedCriterion] : null

  return (
    <>
      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">QA Scorecard</h2>
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
      
      {loading && (
        <div className="space-y-4">
          {/* Skeleton for overall score */}
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-24"></div>
          </div>
          
          {/* Skeleton table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4"><div className="h-4 bg-gray-700 rounded w-20"></div></th>
                  <th className="text-left py-3 px-4"><div className="h-4 bg-gray-700 rounded w-16"></div></th>
                  <th className="text-left py-3 px-4"><div className="h-4 bg-gray-700 rounded w-16"></div></th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-gray-700">
                    <td className="py-3 px-4"><div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div></td>
                    <td className="py-3 px-4"><div className="h-6 bg-gray-700 rounded-full w-10 animate-pulse"></div></td>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      )}

      {error && (
        <div className="border-2 border-red-600 rounded-md bg-red-900/20 p-4">
          <p className="text-red-400 font-medium mb-2">Error</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div>
            <p className="text-sm text-gray-400 mb-1">Overall Score</p>
            <p className="text-2xl font-semibold text-white">
              {calculateOverallScore(result.criteria)}
            </p>
          </div>

          {/* Criteria Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Criterion</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Score</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Notes</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result.criteria).map(([criterion, data]) => {
                  const bulletPoints = formatBulletPoints(data.notes)
                  const formattedName = formatCriterionName(criterion)
                  return (
                    <tr key={criterion} className="border-b border-gray-700">
                      <td className="py-3 px-4 text-sm text-gray-200">
                        <div className="flex items-center gap-2">
                          <span>{formattedName}</span>
                          <button
                            onClick={() => handleOpenRubric(criterion)}
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                            aria-label={`View rubric for ${formattedName}`}
                            title={`View rubric for ${formattedName}`}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                          {data.score}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400">
                        <ul className="list-disc list-inside space-y-1">
                          {bulletPoints.map((point, index) => (
                            <li key={index}>{point.trim()}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {!loading && !error && !result && (
        <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-gray-600 rounded-md bg-gray-800">
          <p className="text-gray-400 text-center px-4">
            Run a review to see QA scores and coaching feedback.
          </p>
        </div>
      )}
      </div>
      <RubricModal
        rubric={selectedRubric}
        isOpen={!!selectedCriterion}
        onClose={handleCloseRubric}
      />
      <FlagModal
        isOpen={showFlagModal}
        onClose={() => setShowFlagModal(false)}
      />
    </>
  )
}

export default OutputPanel
