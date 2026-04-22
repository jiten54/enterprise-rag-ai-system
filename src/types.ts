export interface Document {
  id: string;
  title: string;
  content: string;
}

export interface RagResponse {
  answer: string;
  keyPoints: string[];
  sourceSummary: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ragResult?: RagResponse;
  timestamp: number;
}
