import { visit } from 'unist-util-visit'

const IMAGE_LINK_PATTERN = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i

function isSingleTextChild(node) {
	return node.children?.length === 1 && node.children[0]?.type === 'text'
}

function isImageUrl(url) {
	return IMAGE_LINK_PATTERN.test(url)
}

export function remarkLinkedImages() {
	return (tree) => {
		visit(tree, 'paragraph', (node) => {
			if (node.children.length !== 1) return

			const [child] = node.children
			if (child.type !== 'link') return
			if (!isSingleTextChild(child)) return
			if (child.children[0].value !== child.url) return
			if (!isImageUrl(child.url)) return

			node.type = 'html'
			node.value = [
				'<figure class="article-embedded-image">',
				`<a href="${child.url}" target="_blank" rel="noopener noreferrer">`,
				`<img src="${child.url}" alt="" loading="lazy" decoding="async" />`,
				'</a>',
				'</figure>'
			].join('')
			delete node.children
		})
	}
}
