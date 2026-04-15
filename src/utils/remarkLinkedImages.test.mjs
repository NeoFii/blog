import test from 'node:test'
import assert from 'node:assert/strict'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
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
		'<figure class="article-embedded-image"><button class="article-embedded-image-trigger" type="button" data-embedded-image-src="https://map.neofii.fun/PicGo/677157b3cf01c.webp" data-embedded-image-caption="" aria-label="Expand image"><img src="https://map.neofii.fun/PicGo/677157b3cf01c.webp" alt="" loading="lazy" decoding="async" /></button></figure>'
	)
})

test('supports article image captions with trailing brace syntax', async () => {
	const input =
		'[https://map.neofii.fun/PicGo/677157b3cf01c.webp](https://map.neofii.fun/PicGo/677157b3cf01c.webp){这是一个图片}'

	const output = String(
		await unified()
			.use(remarkParse)
			.use(remarkMdx)
			.use(remarkLinkedImages)
			.use(remarkStringify)
			.process(input)
	).trim()

	assert.equal(
		output,
		'<figure class="article-embedded-image"><button class="article-embedded-image-trigger" type="button" data-embedded-image-src="https://map.neofii.fun/PicGo/677157b3cf01c.webp" data-embedded-image-caption="这是一个图片" aria-label="Expand image"><img src="https://map.neofii.fun/PicGo/677157b3cf01c.webp" alt="这是一个图片" loading="lazy" decoding="async" /></button><figcaption>这是一个图片</figcaption></figure>'
	)
})

test('supports quoted captions for mdx text expressions with spaces', async () => {
	const input =
		'[https://map.neofii.fun/PicGo/677157b3cf01c.webp](https://map.neofii.fun/PicGo/677157b3cf01c.webp){"This is a caption"}'

	const output = String(
		await unified()
			.use(remarkParse)
			.use(remarkMdx)
			.use(remarkLinkedImages)
			.use(remarkStringify)
			.process(input)
	).trim()

	assert.equal(
		output,
		'<figure class="article-embedded-image"><button class="article-embedded-image-trigger" type="button" data-embedded-image-src="https://map.neofii.fun/PicGo/677157b3cf01c.webp" data-embedded-image-caption="This is a caption" aria-label="Expand image"><img src="https://map.neofii.fun/PicGo/677157b3cf01c.webp" alt="This is a caption" loading="lazy" decoding="async" /></button><figcaption>This is a caption</figcaption></figure>'
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
