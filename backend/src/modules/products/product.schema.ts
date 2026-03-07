import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  currentPrice: z.number().positive(),
  minPrice: z.number().positive(),
  maxPrice: z.number().positive(),
  costPrice: z.number().positive(),
})

export const updateProductSchema = createProductSchema.partial()