// Shared type definitions for lecture-related components and hooks

export interface Lecture {
  id: string;
  title: string;
  description: string;
  tags: string[] | string;
  sectionId?: string;
  courseId?: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  lectures: Lecture[];
}

export interface SearchResponse {
  results: Lecture[];
  total: number;
  query: string;
	context: { courseId: string }
}
