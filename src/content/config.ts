import { defineCollection, z } from 'astro:content'
import { CATEGORIES } from '@/data/categories'

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string().max(120),
			description: z.string().optional().default(''),
			// Transform string to Date object
			pubDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			heroImage: image().optional(),
			heroImageUrl: z
				.string()
				.trim()
				.optional()
				.or(z.literal(''))
				.transform((val) => val || undefined)
				.refine((val) => !val || z.string().url().safeParse(val).success, {
					message: 'heroImageUrl must be a valid URL'
				}),
			category: z.enum(CATEGORIES),
			tags: z.array(z.string()),
			draft: z.boolean().default(false)
		})
			.refine((data) => data.heroImage || data.heroImageUrl, {
				message: 'Either heroImage or heroImageUrl is required',
				path: ['heroImageUrl']
			})
})

export const collections = { blog }
