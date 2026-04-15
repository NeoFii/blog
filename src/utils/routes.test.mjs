import test from 'node:test'
import assert from 'node:assert/strict'

import { buildCategoryPath } from './routes.ts'

test('builds category paths with a single leading slash', () => {
	assert.equal(buildCategoryPath('research'), '/category/research/1/')
	assert.equal(buildCategoryPath('machine learning'), '/category/machine-learning/1/')
})
