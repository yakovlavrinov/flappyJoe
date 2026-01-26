import { getYsdk } from '../sdk/yandexSdk'
import en from './en'
import ru from './ru'

type Lang = 'ru' | 'en'
export class LanguageManager {
  private static current: Lang = 'ru'

  private static dict = {
    ru,
    en,
  }

  static setLanguage(lang: Lang) {
    this.current = lang
    localStorage.setItem('lang', lang)
  }

  static init() {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved && this.dict[saved]) {
      this.current = saved
    }
  }

  static t(key: keyof typeof ru): string {
    const ysdk = getYsdk()
    return this.dict[(ysdk?.environment.i18n.lang as Lang) || this.current][key] ?? key
  }

  static getLanguage() {
    return this.current
  }
}
