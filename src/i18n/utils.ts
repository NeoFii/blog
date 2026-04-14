import { ui, defaultLang } from './ui'

export type Lang = keyof typeof ui

export function getLangFromUrl(url: URL): Lang {
	const [, lang] = url.pathname.split('/')
	if (lang in ui) return lang as Lang
	return defaultLang
}

export function useTranslations(lang: Lang) {
	return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
		return ui[lang][key] || ui[defaultLang][key]
	}
}

export function getLocalePath(lang: Lang, path: string): string {
	if (lang === defaultLang) return path
	return `/${lang}${path}`
}

export function getDateLocale(lang: Lang): string {
	return lang === 'zh' ? 'zh-CN' : 'en-US'
}
