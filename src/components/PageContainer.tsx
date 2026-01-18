import { useState, useEffect } from 'react'
import Header from './Header'
import TicketInputPanel from './TicketInputPanel'
import OutputPanel from './OutputPanel'
import CoachingSummary from './CoachingSummary'
import type { QAResult } from '../types'
import { postReview } from '../api/client'
import SAMPLE_TICKET from '../data/sampleTicket.txt?raw'

const STORAGE_KEY_TICKET = 'qa-coaching-agent:ticketText'
const STORAGE_KEY_RESULT = 'qa-coaching-agent:result'

function PageContainer() {
  const [ticketSource, setTicketSource] = useState<'paste' | 'sample1'>('paste')
  const [ticketText, setTicketText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<QAResult | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const savedTicketText = localStorage.getItem(STORAGE_KEY_TICKET)
    if (savedTicketText) {
      setTicketText(savedTicketText)
    }

    const savedResult = localStorage.getItem(STORAGE_KEY_RESULT)
    if (savedResult) {
      try {
        const parsedResult = JSON.parse(savedResult) as QAResult
        setResult(parsedResult)
      } catch (e) {
        // Invalid stored data, ignore
        localStorage.removeItem(STORAGE_KEY_RESULT)
      }
    }
  }, [])

  // Save to localStorage when ticketText or result changes
  useEffect(() => {
    if (ticketText) {
      localStorage.setItem(STORAGE_KEY_TICKET, ticketText)
    } else {
      localStorage.removeItem(STORAGE_KEY_TICKET)
    }
  }, [ticketText])

  useEffect(() => {
    if (result) {
      localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(result))
    } else {
      localStorage.removeItem(STORAGE_KEY_RESULT)
    }
  }, [result])

  // Format sample ticket with double spacing between lines
  const formatSampleTicket = (text: string): string => {
    return text.split('\n').join('\n\n')
  }

  // Auto-populate sample ticket when selected from dropdown
  useEffect(() => {
    if (ticketSource === 'sample1') {
      const formattedTicket = formatSampleTicket(SAMPLE_TICKET)
      setTicketText(formattedTicket)
    }
  }, [ticketSource])

  const handleClear = () => {
    setTicketText('')
    setResult(null)
    setError(null)
    localStorage.removeItem(STORAGE_KEY_TICKET)
    localStorage.removeItem(STORAGE_KEY_RESULT)
  }

  const handleGenerateReview = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Always use 'text' format since we removed JSON option
      const result = await postReview('text', ticketText)
      setResult(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate QA review'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 mb-6">
          <TicketInputPanel
            ticketSource={ticketSource}
            ticketText={ticketText}
            onTicketSourceChange={setTicketSource}
            onTicketTextChange={setTicketText}
            onGenerateReview={handleGenerateReview}
            onClear={handleClear}
            disabled={ticketText.trim().length === 0 || ticketText.trim().length < 50 || loading}
          />
          <OutputPanel
            loading={loading}
            error={error}
            result={result}
          />
        </div>
        {result && (
          <CoachingSummary
            summary={result.coaching_summary}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}

export default PageContainer
