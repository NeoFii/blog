import { visit } from 'unist-util-visit'

const IMAGE_LINK_PATTERN = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i

function isSingleTextChild(node) {
	return node.children?.length === 1 && node.children[0]?.type === 'text'
}

function isImageUrl(url) {
	return IMAGE_LINK_PATTERN.test(url)
}

function escapeHtml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
}

function getCaption(children) {
	if (children.length === 1) return null
	if (children.length !== 2) return null

	const [, captionNode] = children
	if (captionNode.type === 'text') {
		const match = captionNode.value.match(/^\{([^{}]+)\}$/)
		if (!match) return null
		return match[1].trim() || null
	}

	if (captionNode.type === 'mdxTextExpression') {
		const expression = captionNode.data?.estree?.body?.[0]?.expression

		if (expression?.type === 'Literal' && typeof expression.value === 'string') {
			return expression.value.trim() || null
		}

		return captionNode.value?.trim() || null
	}

	return null
}

export function remarkLinkedImages() {
	return (tree) => {
		visit(tree, 'paragraph', (node) => {
			if (node.children.length < 1 || node.children.length > 2) return

			const [child] = node.children
			if (child.type !== 'link') return
			if (!isSingleTextChild(child)) return
			if (child.children[0].value !== child.url) return
			if (!isImageUrl(child.url)) return

			const caption = getCaption(node.children)
			if (node.children.length === 2 && !caption) return

			const safeUrl = escapeHtml(child.url)
			const safeCaption = caption ? escapeHtml(caption) : null
			node.type = 'html'
			node.value = [
				'<figure class="article-embedded-image">',
				`<button class="article-embedded-image-trigger" type="button" data-embedded-image-src="${safeUrl}" data-embedded-image-caption="${safeCaption || ''}" aria-label="Expand image">`,
				`<img src="${safeUrl}" alt="${safeCaption || ''}" loading="lazy" decoding="async" />`,
				'</button>',
				safeCaption ? `<figcaption>${safeCaption}</figcaption>` : '',
				'</figure>'
			].join('')
			delete node.children
		})
	}
}
