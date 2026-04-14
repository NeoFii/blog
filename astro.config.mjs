import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import rehypeExternalLinks from 'rehype-external-links'
import { remarkReadingTime } from './src/utils/readTime.ts'
import { siteConfig } from './src/data/site.config'

// https://astro.build/config
export default defineConfig({
	site: siteConfig.site,
	outDir: './dist',
	i18n: {
		defaultLocale: 'zh',
		locales: ['zh', 'en'],
		routing: {
			prefixDefaultLocale: false
		}
	},
	markdown: {
		remarkPlugins: [remarkReadingTime],
		rehypePlugins: [
			[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
		],
		drafts: true,
		shikiConfig: {
			theme: 'material-theme-palenight',
			wrap: true
		}
	},
	vite: {
		plugins: [{
			name: 'remove-deprecated-optimizedeps',
			config(config) {
				if (config.optimizeDeps?.disabled !== undefined) {
					delete config.optimizeDeps.disabled
				}
			}
		}]
	},
	integrations: [
		mdx({
			syntaxHighlight: 'shiki',
			shikiConfig: {
				experimentalThemes: {
					light: 'vitesse-light',
					dark: 'material-theme-palenight',
				  },
				wrap: true
			},
			drafts: true
		}),
		sitemap(),
		tailwind()
	]
})
