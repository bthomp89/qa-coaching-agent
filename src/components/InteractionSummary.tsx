interface InteractionSummaryProps {
  summary: string | null
  loading: boolean
}

function InteractionSummary({ summary, loading }: InteractionSummaryProps) {
  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6 animate-pulse">
        <h2 className="text-lg font-semibold text-white mb-4">Interaction Summary</h2>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!summary) {
    return null
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Interaction Summary</h2>
      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
        {summary}
      </p>
    </div>
  )
}

export default InteractionSummary
