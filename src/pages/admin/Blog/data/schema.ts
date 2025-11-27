import { z } from 'zod'

export const blogSchema = z.object({
  id: z.string(),
  imageUrl: z.string(),
  description: z.string(),
  title: z.string(),
  status: z.string(),
  active: z.string(),
})

export type Blog = z.infer<typeof blogSchema>