export interface VideoItem {
  id: string;
  name: string;
  url: string | null;
  description: string | null;
  category: string | null;
  created_at?: string | null;
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  date: string;
  description: string;
  category: 'NEWS' | 'UPDATE' | 'PATCH';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'teammate' | 'video' | 'build' | 'dictionary';
  url: string;
}
