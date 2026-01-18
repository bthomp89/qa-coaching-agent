export type QAResult = {
  criteria: Record<string, { score: number; notes: string }>;
  coaching_summary: string;
};
