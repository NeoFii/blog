import type { CollectionEntry } from 'astro:content'

type BlogPostData = CollectionEntry<'blog'>['data']

export function resolveCoverImage({
	heroImage,
	heroImageUrl
}: Pick<BlogPostData, 'heroImage' | 'heroImageUrl'>) {
	const externalUrl = heroImageUrl?.trim()

	if (externalUrl) {
		return {
			src: externalUrl,
			ogImage: externalUrl,
			isExternal: true
		} as const
	}

	if (heroImage) {
		return {
			src: heroImage,
			ogImage: heroImage.src,
			isExternal: false
		} as const
	}

	return null
}
