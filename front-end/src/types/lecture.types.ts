// Shared type definitions for lecture-related components and hooks

export interface Lecture {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface SearchResponse {
  results: Lecture[];
  total: number;
  query: string;
	context: { courseId: string }
}
