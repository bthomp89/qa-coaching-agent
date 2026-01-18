import type { RubricDefinition } from '../constants/rubrics'

interface RubricModalProps {
  rubric: RubricDefinition | null
  isOpen: boolean
  onClose: () => void
}

function RubricModal({ rubric, isOpen, onClose }: RubricModalProps) {
  if (!isOpen || !rubric) return null

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
          <h2 className="text-xl font-semibold text-white">{rubric.title}</h2>
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
          <p className="text-gray-300 mb-6">{rubric.description}</p>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Scoring Rubric:</h3>
            {rubric.scores.map((item) => (
              <div key={item.score} className="border-l-4 border-gray-600 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white text-sm font-semibold">
                    {item.score}
                  </span>
                  <span className="text-white font-medium">Score {item.score}</span>
                </div>
                <p className="text-gray-300 text-sm ml-10">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RubricModal
