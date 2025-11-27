import { z } from 'zod'

export const blogSchema = z.object({
  id: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  active: z.boolean(),
  status: z.number(),
})

export type Blog = z.infer<typeof blogSchema>