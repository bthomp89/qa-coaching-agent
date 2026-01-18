import { useState, useEffect } from 'react'
import Header from './Header'
import TicketInputPanel from './TicketInputPanel'
import OutputPanel from './OutputPanel'
import type { QAResult } from '../types'
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

    // Simulate 1.5s delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock result with 5 criteria
    const mockResult: QAResult = {
      criteria: {
        Empathy: {
          score: 4,
          notes: 'Good acknowledgment of customer urgency, but could show more understanding of the business impact (SOC 2 audit context).'
        },
        'Technical Accuracy': {
          score: 3,
          notes: 'Suggested troubleshooting steps were reasonable but repetitive. Failed to investigate the previous incident mentioned by customer.'
        },
        'Resolution Path': {
          score: 3,
          notes: 'Agent escalated appropriately only after customer insisted. Should have escalated earlier given the severity (Sev 1) and business impact.'
        },
        'Escalation Timing': {
          score: 2,
          notes: 'Escalation occurred too late in the conversation. A Sev 1 issue affecting critical audit processes should trigger immediate escalation.'
        },
        Documentation: {
          score: 4,
          notes: 'Requested relevant user data, but should have asked about the previous incident details earlier in the conversation.'
        }
      },
      coaching_summary: 'The agent demonstrated basic troubleshooting skills and eventually escalated, but missed several key opportunities. The customer explicitly mentioned a prior similar incident (race condition in role evaluation engine), which should have been the first thing investigated rather than suggesting token regeneration. Given the SOC 2 audit context and Sev 1 classification, escalation should have happened immediately after the first response indicated an ongoing critical issue affecting compliance. The agent should proactively acknowledge the prior incident and check internal systems for known issues before asking the customer to retry steps they\'ve already completed.'
    }

    setResult(mockResult)
    setLoading(false)
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
