export type LanguageCode = 'en' | 'fi' | 'sv' | 'no';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flagEmoji: string;
  description: string;
}

export interface Unit {
  id: string;
  languageCode: LanguageCode;
  order: number;
  title: string;
  description: string;
}

export type ActivityType = 'warmup' | 'vocabulary' | 'phrases' | 'review';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
}

export interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  example?: string;
}

export interface Phrase {
  id: string;
  text: string;
  translation: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  languageCode: LanguageCode;
  order: number;
  title: string;
  description: string;
  goal: string;
  estimatedMinutes: number;
  xpReward: number;
  imageKey?: string;
  activities: Activity[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  aiTeacherPrompt: string;
}
