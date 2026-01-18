import type { QAResult } from '../types'

interface OutputPanelProps {
  loading: boolean
  error: string | null
  result: QAResult | null
}

function OutputPanel({ loading, error, result }: OutputPanelProps) {
  // Calculate overall score from criteria scores
  const calculateOverallScore = (criteria: QAResult['criteria']): number => {
    const scores = Object.values(criteria).map(c => c.score)
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
    return Math.round(average * 10) / 10 // Round to 1 decimal
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">QA Scorecard</h2>
      
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
          
          {/* Skeleton for coaching summary */}
          <div className="border border-gray-700 rounded-md p-4 bg-gray-800 animate-pulse">
            <div className="h-5 bg-gray-700 rounded w-40 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
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
                {Object.entries(result.criteria).map(([criterion, data]) => (
                  <tr key={criterion} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-sm text-gray-200">{criterion}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                        {data.score}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">{data.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Coaching Summary Card */}
          <div className="border border-gray-700 rounded-md p-4 bg-gray-800">
            <h3 className="text-md font-semibold text-white mb-2">Coaching Summary</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{result.coaching_summary}</p>
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
  )
}

export default OutputPanel
