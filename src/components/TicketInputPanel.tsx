interface TicketInputPanelProps {
  ticketSource: 'paste' | 'sample1'
  ticketText: string
  onTicketSourceChange: (source: 'paste' | 'sample1') => void
  onTicketTextChange: (text: string) => void
  onGenerateReview: () => void
  onClear: () => void
  disabled?: boolean
}

function TicketInputPanel({
  ticketSource,
  ticketText,
  onTicketSourceChange,
  onTicketTextChange,
  onGenerateReview,
  onClear,
  disabled = false
}: TicketInputPanelProps) {
  return (
    <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Ticket Input</h2>
      
      <div className="mb-4">
        <label htmlFor="ticket-source" className="block text-sm font-medium text-gray-300 mb-2">
          Ticket source
        </label>
        <select
          id="ticket-source"
          value={ticketSource}
          onChange={(e) => onTicketSourceChange(e.target.value as 'paste' | 'sample1')}
          className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="paste">Paste ticket text</option>
          <option value="sample1">Sample Ticket #1</option>
        </select>
      </div>

      <div className="mb-4">
        <textarea
          value={ticketText}
          onChange={(e) => onTicketTextChange(e.target.value)}
          rows={14}
          placeholder="Subject: Example Ticket Subject&#10;&#10;From: customer@example.com&#10;Date: 2024-01-15&#10;&#10;Message:&#10;This is an example of a Zendesk ticket format. Paste your full ticket context here including subject, messages, and replies."
          className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono resize-y"
        />
        <p className="mt-2 text-xs text-gray-400">
          Paste the full ticket context: subject + messages + replies.
        </p>
        {ticketText.length > 15000 && (
          <p className="mt-2 text-xs text-amber-400">
            Large ticket detected — responses may be slower.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onGenerateReview}
          disabled={disabled}
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-700"
        >
          Generate QA Review
        </button>
        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default TicketInputPanel
