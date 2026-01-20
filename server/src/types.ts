export type QAResult = {
  criteria: Record<string, { score: number; notes: string }>;
  coaching_summary: string;
  interaction_summary: string;
};

export type ReviewRequest = {
  inputFormat: 'text' | 'json';
  ticketText: string;
};

export type ReviewResponse = QAResult;

export type ThemeAnalysisRequest = {
  ticketText: string;
};

export type ThemeAnalysisResponse = {
  coaching_themes: Array<{
    theme: string;
    reason: string;
  }>;
};
