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
  }

  static init() {
    const ysdk = getYsdk()

    this.current = ysdk?.environment?.i18n?.lang as Lang
  }

  static t(key: keyof typeof ru): string {
    return this.dict[this.current || 'ru'][key]
  }

  static getLanguage() {
    return this.current
  }
}
