import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BLOG_ROOT = path.resolve('src/content/blog')
const CATEGORIES_FILE = path.resolve('src/data/categories.ts')

const usage = () => {
	console.error('Usage: pnpm new <Category>/<slug>')
	console.error('   or: pnpm new -c <Category>')
	process.exit(1)
}

const toTitle = (value) =>
	value
		.split(/[-_]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ')

const getCategories = async () => {
	const entries = await readdir(BLOG_ROOT, { withFileTypes: true })
	return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
}

const readConfiguredCategories = async () => {
	const source = await readFile(CATEGORIES_FILE, 'utf8')
	const match = source.match(/export const CATEGORIES = \[(.*?)\] as const/s)

	if (!match) {
		throw new Error(`Unable to parse categories from ${CATEGORIES_FILE}`)
	}

	return [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1])
}

const writeConfiguredCategories = async (categories) => {
	const lines = [
		'// List of categories for blog posts',
		`export const CATEGORIES = [${categories.map((category) => `'${category}'`).join(', ')}] as const`,
		''
	]

	await writeFile(CATEGORIES_FILE, lines.join('\n'))
}

const createCategory = async (category) => {
	if (!category || category.includes('/')) {
		console.error('Category name must be a single path segment.')
		process.exit(1)
	}

	const categories = await readConfiguredCategories()

	if (categories.includes(category)) {
		console.error(`Category already exists: ${category}`)
		process.exit(1)
	}

	await writeConfiguredCategories([...categories, category])
	await mkdir(path.join(BLOG_ROOT, category), { recursive: true })
	console.log(`Created category ${category}`)
}

const createPost = async (input) => {
	const normalizedInput = input.replace(/\.mdx$/i, '')
	const segments = normalizedInput.split('/').filter(Boolean)

	if (segments.length < 2) {
		usage()
	}

	const [category, ...rest] = segments
	const slug = rest.join('/')
	const validCategories = await getCategories()

	if (!validCategories.includes(category)) {
		console.error(`Unknown category "${category}". Available categories: ${validCategories.join(', ')}`)
		process.exit(1)
	}

	const filename = `${slug}.mdx`
	const targetPath = path.join(BLOG_ROOT, category, filename)

	const template = `---
heroImageUrl: 'https://example.com/replace-me.jpg'
category: ${category}
description: ''
pubDate: ${new Date().toISOString()}
draft: true
tags:
  - draft
title: ${toTitle(path.basename(slug))}
---

## ${toTitle(path.basename(slug))}
`

	try {
		await mkdir(path.dirname(targetPath), { recursive: true })
		await writeFile(targetPath, template, { flag: 'wx' })
		console.log(`Created ${path.relative(process.cwd(), targetPath)}`)
	} catch (error) {
		if (error && typeof error === 'object' && 'code' in error && error.code === 'EEXIST') {
			console.error(`File already exists: ${path.relative(process.cwd(), targetPath)}`)
			process.exit(1)
		}

		throw error
	}
}

const command = process.argv[2]?.trim()

if (!command) {
	usage()
}

if (command === '-c' || command === '--category') {
	const category = process.argv[3]?.trim()

	if (!category) {
		usage()
	}

	await createCategory(category)
} else {
	await createPost(command)
}
