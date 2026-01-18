import { useState, useEffect } from 'react'
import Header from './Header'
import TicketInputPanel from './TicketInputPanel'
import OutputPanel from './OutputPanel'
import type { QAResult } from '../types'
import { postReview } from '../api/client'
import SAMPLE_TICKET from '../data/sampleTicket.txt?raw'

const STORAGE_KEY_TICKET = 'qa-coaching-agent:ticketText'
const STORAGE_KEY_RESULT = 'qa-coaching-agent:result'

function PageContainer() {
  const [inputFormat, setInputFormat] = useState<'text' | 'json'>('text')
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

  const handleLoadSampleTicket = () => {
    setTicketText(SAMPLE_TICKET)
  }

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

    // Validate JSON if inputFormat is json
    if (inputFormat === 'json') {
      try {
        JSON.parse(ticketText)
      } catch (e) {
        setError('Invalid JSON format. Please check your input.')
        setLoading(false)
        return
      }
    }

    try {
      const result = await postReview(inputFormat, ticketText)
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TicketInputPanel
            inputFormat={inputFormat}
            ticketText={ticketText}
            onInputFormatChange={setInputFormat}
            onTicketTextChange={setTicketText}
            onLoadSample={handleLoadSampleTicket}
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
      </div>
    </div>
  )
}

export default PageContainer
