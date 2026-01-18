import type { QAResult, ReviewRequest } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function postReview(
  inputFormat: 'text' | 'json',
  ticketText: string
): Promise<QAResult> {
  const url = `${API_BASE_URL}/api/review`
  const body: ReviewRequest = {
    inputFormat,
    ticketText
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      // Try to parse error message from server
      let errorMessage = 'Failed to generate QA review'
      try {
        const errorData = await response.json()
        if (errorData.error && typeof errorData.error === 'string') {
          errorMessage = errorData.error
        }
      } catch (e) {
        // If JSON parsing fails, use fallback message
      }
      throw new Error(errorMessage)
    }

    const result: QAResult = await response.json()
    return result
  } catch (error) {
    // Handle network errors or other fetch errors
    if (error instanceof Error) {
      // If it's already an Error we threw, rethrow it
      throw error
    }
    // If it's something else, wrap it
    throw new Error('Network error: Unable to reach server')
  }
}
