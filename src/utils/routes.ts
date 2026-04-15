import { sluglify } from './sluglify.ts'

export function buildCategoryPath(category: string) {
	return `/category/${sluglify(category.toLowerCase())}/1/`
}
