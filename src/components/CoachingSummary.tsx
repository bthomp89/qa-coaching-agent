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
  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6 animate-pulse">
        <h2 className="text-lg font-semibold text-white mb-4">Coaching Summary</h2>
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

  const { summaryParagraph, improvementPoints } = parseCoachingSummary(summary)

  return (
    <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Coaching Summary</h2>
      
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
  )
}

export default CoachingSummary
