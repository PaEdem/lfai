import type { Language, LanguageCode } from '@/types/learning';

export const languages: Language[] = [
  {
    code: 'en',
    name: 'Английский',
    nativeName: 'English',
    flagEmoji: 'https://flagcdn.com/120x90/gb.png',
    description: 'Самый популярный язык международного общения.',
  },
  {
    code: 'fi',
    name: 'Финский',
    nativeName: 'Suomi',
    flagEmoji: 'https://flagcdn.com/120x90/fi.png',
    description: 'Язык Финляндии с уникальной грамматикой.',
  },
  {
    code: 'sv',
    name: 'Шведский',
    nativeName: 'Svenska',
    flagEmoji: 'https://flagcdn.com/120x90/se.png',
    description: 'Мелодичный язык Скандинавии.',
  },
  {
    code: 'no',
    name: 'Норвежский',
    nativeName: 'Norsk',
    flagEmoji: 'https://flagcdn.com/120x90/no.png',
    description: 'Язык фьордов и северного сияния.',
  },
];

export function getLanguageByCode(code: LanguageCode): Language | undefined {
  return languages.find((language) => language.code === code);
}
