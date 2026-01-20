interface ThemeInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

const THEMES = [
  {
    name: 'Unclear or Incomplete Explanation',
    description: 'The agent\'s response lacks clarity, omits important details, or fails to fully explain the solution or next steps to the customer.'
  },
  {
    name: 'Missed or Delayed Escalation',
    description: 'The agent did not escalate the issue when appropriate, escalated too late, or failed to recognize when escalation was necessary.'
  },
  {
    name: 'Lack of Ownership or Empathy',
    description: 'The agent did not take responsibility for resolving the issue or failed to acknowledge and address the customer\'s emotional needs and concerns.'
  },
  {
    name: 'Redundant or Ineffective Troubleshooting',
    description: 'The agent repeated troubleshooting steps that were already attempted, suggested irrelevant solutions, or did not follow a logical troubleshooting progression.'
  },
  {
    name: 'Policy / Process Misalignment',
    description: 'The agent did not follow established policies or processes, provided incorrect policy information, or made decisions that conflict with company guidelines.'
  }
]

function ThemeInfoModal({ isOpen, onClose }: ThemeInfoModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Coaching Themes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-300 mb-6">
            The theme analysis identifies the top coaching themes that best describe improvement opportunities in the agent's response. 
            Each theme represents a specific area where the agent's performance could be enhanced.
          </p>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Available Themes:</h3>
            {THEMES.map((theme, index) => (
              <div key={index} className="border-l-4 border-indigo-600 pl-4 py-3 bg-gray-800 rounded-r-md">
                <h4 className="text-white font-medium mb-2">{theme.name}</h4>
                <p className="text-gray-300 text-sm">{theme.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeInfoModal
