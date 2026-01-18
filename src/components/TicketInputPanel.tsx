import { useState } from 'react'

function TicketInputPanel() {
  const [inputFormat, setInputFormat] = useState('text')
  const [ticketText, setTicketText] = useState('')

  return (
    <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Ticket Input</h2>
      
      <div className="mb-4">
        <label htmlFor="input-format" className="block text-sm font-medium text-gray-300 mb-2">
          Input format
        </label>
        <select
          id="input-format"
          value={inputFormat}
          onChange={(e) => setInputFormat(e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="text">Paste ticket text</option>
          <option value="json">Paste JSON</option>
        </select>
      </div>

      <div className="mb-4">
        <textarea
          value={ticketText}
          onChange={(e) => setTicketText(e.target.value)}
          rows={14}
          placeholder="Subject: Example Ticket Subject&#10;&#10;From: customer@example.com&#10;Date: 2024-01-15&#10;&#10;Message:&#10;This is an example of a Zendesk ticket format. Paste your full ticket context here including subject, messages, and replies."
          className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono resize-y"
        />
        <p className="mt-2 text-xs text-gray-400">
          Paste the full ticket context: subject + messages + replies.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
        >
          Generate QA Review
        </button>
        <button
          type="button"
          className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
        >
          Load Sample Ticket
        </button>
      </div>
    </div>
  )
}

export default TicketInputPanel
