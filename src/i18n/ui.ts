export const languages = {
	zh: '中文',
	en: 'English'
} as const

export const defaultLang = 'en' as const

export const ui = {
	zh: {
		'nav.home': '首页',
		'nav.tags': '标签',
		'nav.search.close': '关闭',
		'home.latest': '最新文章',
		'post.read': '阅读全文',
		'post.published': '发布于',
		'post.related': '相关文章',
		'post.noRelated': '暂无相关文章 😢',
		'post.share': '分享',
		'post.toc': '目录',
		'category.viewAll': '全部',
		'footer.rights': '保留所有权利。',
		'search.devOnly': '搜索仅在生产构建中可用。请构建并预览站点以本地测试。',
		'cms.edit': '在 CMS 中编辑',
		'share.message': '分享这篇文章'
	},
	en: {
		'nav.home': 'Home',
		'nav.tags': 'Tags',
		'nav.search.close': 'Close',
		'home.latest': 'Latest Posts',
		'post.read': 'Read Post',
		'post.published': 'Published',
		'post.related': 'Related Posts',
		'post.noRelated': 'There are no related posts yet. 😢',
		'post.share': 'Share',
		'post.toc': 'Index',
		'category.viewAll': 'View All',
		'footer.rights': 'All rights reserved.',
		'search.devOnly':
			'Search is only available in production builds. Try building and previewing the site to test it out locally.',
		'cms.edit': 'Edit in CMS',
		'share.message': 'Share this post'
	}
} as const
