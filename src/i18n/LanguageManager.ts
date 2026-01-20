type Lang = 'ru' | 'en'

import ru from './ru'
import en from './en'

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
    return this.dict[this.current][key] ?? key
  }

  static getLanguage() {
    return this.current
  }
}
