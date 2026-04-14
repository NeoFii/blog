import test from 'node:test'
import assert from 'node:assert/strict'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'

import { remarkLinkedImages } from './remarkLinkedImages.js'

test('converts standalone image links into article embedded image blocks', async () => {
	const input = '[https://map.neofii.fun/PicGo/677157b3cf01c.webp](https://map.neofii.fun/PicGo/677157b3cf01c.webp)'

	const output = String(
		await unified()
			.use(remarkParse)
			.use(remarkLinkedImages)
			.use(remarkStringify)
			.process(input)
	).trim()

	assert.equal(
		output,
		'<figure class="article-embedded-image"><a href="https://map.neofii.fun/PicGo/677157b3cf01c.webp" target="_blank" rel="noopener noreferrer"><img src="https://map.neofii.fun/PicGo/677157b3cf01c.webp" alt="" loading="lazy" decoding="async" /></a></figure>'
	)
})

test('keeps non-image links unchanged', async () => {
	const input = '[OpenAI](https://openai.com/)'

	const output = String(
		await unified()
			.use(remarkParse)
			.use(remarkLinkedImages)
			.use(remarkStringify)
			.process(input)
	).trim()

	assert.equal(output, input)
})
