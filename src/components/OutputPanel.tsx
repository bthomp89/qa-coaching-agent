function OutputPanel() {
  return (
    <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">QA Output</h2>
      
      <div className="flex items-center justify-center min-h-[400px] border-2 border-dashed border-gray-600 rounded-md bg-gray-800">
        <p className="text-gray-400 text-center px-4">
          Run a review to see QA scores and coaching feedback.
        </p>
      </div>
    </div>
  )
}

export default OutputPanel
