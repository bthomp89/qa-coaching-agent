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

  const bulletPoints = formatBulletPoints(summary)

  return (
    <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Coaching Summary</h2>
      <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
        {bulletPoints.map((point, index) => (
          <li key={index}>{point.trim()}</li>
        ))}
      </ul>
    </div>
  )
}

export default CoachingSummary
