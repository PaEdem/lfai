import type { LanguageCode, Unit } from '@/types/learning';

export const units: Unit[] = [
  // English
  {
    id: 'en-unit-1',
    languageCode: 'en',
    order: 1,
    title: 'Знакомство',
    description: 'Приветствия, знакомство и первые фразы на английском.',
  },
  {
    id: 'en-unit-2',
    languageCode: 'en',
    order: 2,
    title: 'Повседневная жизнь',
    description: 'Числа, еда и напитки, разговоры о городе.',
  },

  // Finnish
  {
    id: 'fi-unit-1',
    languageCode: 'fi',
    order: 1,
    title: 'Знакомство',
    description: 'Приветствия, знакомство и первые фразы на финском.',
  },
  {
    id: 'fi-unit-2',
    languageCode: 'fi',
    order: 2,
    title: 'Повседневная жизнь',
    description: 'Числа, еда и напитки, разговоры о городе.',
  },

  // Swedish — заглушка, будет расширена (см. prompts/11-lesson-ui.md)
  {
    id: 'sv-unit-1',
    languageCode: 'sv',
    order: 1,
    title: 'Первые слова',
    description: 'Базовые приветствия на шведском.',
  },

  // Norwegian — заглушка, будет расширена (см. prompts/11-lesson-ui.md)
  {
    id: 'no-unit-1',
    languageCode: 'no',
    order: 1,
    title: 'Первые слова',
    description: 'Базовые приветствия на норвежском.',
  },
];

export function getUnitsByLanguage(languageCode: LanguageCode): Unit[] {
  return units
    .filter((unit) => unit.languageCode === languageCode)
    .sort((a, b) => a.order - b.order);
}

export function getUnitById(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}
