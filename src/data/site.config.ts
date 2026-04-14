interface SiteConfig {
	site: string
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
}

export const siteConfig: SiteConfig = {
	site: 'https://blog-template-gray.vercel.app/', // Write here your website url
	author: 'NeoFii', // Site author
	title: 'Blog', // Site title.
	description: '', // Description to display in the meta tags
	lang: 'zh_CN',
	ogLocale: 'zh_CN',
	shareMessage: 'Share this post', // Message to share a post on social media
	paginationSize: 6 // Number of posts per page
}
