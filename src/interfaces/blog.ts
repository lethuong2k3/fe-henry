import { z } from 'zod'

export const blogSchema = z.object({
  id: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  active: z.string(),
  status: z.string(),
})

export interface BlogRequest {
  title: string,
  description: string,
  imageUrl: string,
  active: string,
  status: string,
}

export type SortDirection = 'asc' | 'desc';

export interface SearchBlogRequest {
  search: string;
  status?: string | null;     
  active?: string | null;     
  page?: number;
  size?: number;
  sortBy: string;
  direction: SortDirection;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;  
  first: boolean;
  last: boolean;
}

export type Blog = z.infer<typeof blogSchema>