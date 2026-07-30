import type { Activity, Lesson, LanguageCode, Phrase, VocabularyItem } from '@/types/learning';

// Родительный падеж названия языка — нужен только для сборки текста
// системного промпта AI-учителя ("учитель ... языка").
const languageGenitive: Record<LanguageCode, string> = {
  en: 'английского',
  fi: 'финского',
  sv: 'шведского',
  no: 'норвежского',
};

function buildActivities(lessonId: string): Activity[] {
  return [
    {
      id: `${lessonId}-warmup`,
      type: 'warmup',
      title: 'Разминка',
      description: 'Короткое приветствие с AI-учителем на изучаемом языке.',
    },
    {
      id: `${lessonId}-vocabulary`,
      type: 'vocabulary',
      title: 'Новые слова',
      description: 'Знакомство с лексикой урока.',
    },
    {
      id: `${lessonId}-phrases`,
      type: 'phrases',
      title: 'Практика фраз',
      description: 'Отработка ключевых фраз в диалоге с AI-учителем.',
    },
    {
      id: `${lessonId}-review`,
      type: 'review',
      title: 'Повторение',
      description: 'Краткое подведение итогов урока.',
    },
  ];
}

function buildAiTeacherPrompt(languageCode: LanguageCode, topic: string): string {
  return `Ты — дружелюбный AI-учитель ${languageGenitive[languageCode]} языка. Веди урок на русском языке и разбирай тему «${topic}». Произноси слова и фразы на изучаемом языке чётко, проси ученика повторить их вслух, мягко исправляй ошибки произношения и хвали за успехи.`;
}

function vocab(id: string, term: string, translation: string, example?: string): VocabularyItem {
  return { id, term, translation, example };
}

function phrase(id: string, text: string, translation: string): Phrase {
  return { id, text, translation };
}

export const lessons: Lesson[] = [
  // ---------------------------------------------------------------------
  // English — Unit 1: Знакомство
  // ---------------------------------------------------------------------
  {
    id: 'en-unit-1-lesson-1',
    unitId: 'en-unit-1',
    languageCode: 'en',
    order: 1,
    title: 'Привет и пока',
    description: 'Учимся здороваться и прощаться на английском.',
    goal: 'Научиться здороваться, прощаться и использовать базовые вежливые слова.',
    estimatedMinutes: 6,
    xpReward: 10,
    activities: buildActivities('en-unit-1-lesson-1'),
    vocabulary: [
      vocab('en-1-1-v1', 'hello', 'привет'),
      vocab('en-1-1-v2', 'good morning', 'доброе утро'),
      vocab('en-1-1-v3', 'good evening', 'добрый вечер'),
      vocab('en-1-1-v4', 'goodbye', 'до свидания'),
      vocab('en-1-1-v5', 'please', 'пожалуйста'),
      vocab('en-1-1-v6', 'thank you', 'спасибо'),
      vocab('en-1-1-v7', 'yes', 'да'),
      vocab('en-1-1-v8', 'no', 'нет'),
    ],
    phrases: [
      phrase('en-1-1-p1', 'Hello, how are you?', 'Привет, как дела?'),
      phrase('en-1-1-p2', 'Nice to meet you.', 'Приятно познакомиться.'),
      phrase('en-1-1-p3', 'See you later!', 'Увидимся позже!'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('en', 'приветствия и прощания'),
  },
  {
    id: 'en-unit-1-lesson-2',
    unitId: 'en-unit-1',
    languageCode: 'en',
    order: 2,
    title: 'Как тебя зовут?',
    description: 'Учимся представляться и рассказывать, откуда мы.',
    goal: 'Научиться представляться и спрашивать имя и происхождение собеседника.',
    estimatedMinutes: 7,
    xpReward: 10,
    activities: buildActivities('en-unit-1-lesson-2'),
    vocabulary: [
      vocab('en-1-2-v1', 'name', 'имя'),
      vocab('en-1-2-v2', 'I am', 'я (являюсь)'),
      vocab('en-1-2-v3', 'from', 'из'),
      vocab('en-1-2-v4', 'to live', 'жить'),
      vocab('en-1-2-v5', 'to meet', 'встречать(ся)'),
    ],
    phrases: [
      phrase('en-1-2-p1', "What's your name?", 'Как тебя зовут?'),
      phrase('en-1-2-p2', 'My name is Anna.', 'Меня зовут Анна.'),
      phrase('en-1-2-p3', 'Where are you from?', 'Откуда ты?'),
      phrase('en-1-2-p4', "I'm from Russia.", 'Я из России.'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('en', 'знакомство и представление себя'),
  },
  {
    id: 'en-unit-1-lesson-3',
    unitId: 'en-unit-1',
    languageCode: 'en',
    order: 3,
    title: 'Как дела?',
    description: 'Учимся спрашивать о самочувствии и коротко отвечать.',
    goal: 'Научиться спрашивать собеседника о делах и отвечать на этот вопрос.',
    estimatedMinutes: 6,
    xpReward: 10,
    activities: buildActivities('en-unit-1-lesson-3'),
    vocabulary: [
      vocab('en-1-3-v1', 'how', 'как'),
      vocab('en-1-3-v2', 'fine', 'хорошо'),
      vocab('en-1-3-v3', 'bad', 'плохо'),
      vocab('en-1-3-v4', 'so-so', 'так себе'),
      vocab('en-1-3-v5', 'today', 'сегодня'),
    ],
    phrases: [
      phrase('en-1-3-p1', 'How are you?', 'Как дела?'),
      phrase('en-1-3-p2', "I'm fine, thank you.", 'У меня всё хорошо, спасибо.'),
      phrase('en-1-3-p3', 'Not bad.', 'Неплохо.'),
      phrase('en-1-3-p4', 'And you?', 'А у тебя?'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('en', 'вопросы о самочувствии'),
  },

  // ---------------------------------------------------------------------
  // English — Unit 2: Повседневная жизнь
  // ---------------------------------------------------------------------
  {
    id: 'en-unit-2-lesson-1',
    unitId: 'en-unit-2',
    languageCode: 'en',
    order: 1,
    title: 'Числа',
    description: 'Учим числа от одного до десяти.',
    goal: 'Выучить числа от одного до десяти и уметь называть свой возраст.',
    estimatedMinutes: 7,
    xpReward: 10,
    activities: buildActivities('en-unit-2-lesson-1'),
    vocabulary: [
      vocab('en-2-1-v1', 'one', 'один'),
      vocab('en-2-1-v2', 'two', 'два'),
      vocab('en-2-1-v3', 'three', 'три'),
      vocab('en-2-1-v4', 'four', 'четыре'),
      vocab('en-2-1-v5', 'five', 'пять'),
      vocab('en-2-1-v6', 'ten', 'десять'),
    ],
    phrases: [
      phrase('en-2-1-p1', 'How old are you?', 'Сколько тебе лет?'),
      phrase('en-2-1-p2', 'I am twenty years old.', 'Мне двадцать лет.'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('en', 'числа и возраст'),
  },
  {
    id: 'en-unit-2-lesson-2',
    unitId: 'en-unit-2',
    languageCode: 'en',
    order: 2,
    title: 'Еда и напитки',
    description: 'Учимся заказывать еду и напитки.',
    goal: 'Освоить базовую лексику для заказа еды и напитков в кафе.',
    estimatedMinutes: 7,
    xpReward: 10,
    activities: buildActivities('en-unit-2-lesson-2'),
    vocabulary: [
      vocab('en-2-2-v1', 'water', 'вода'),
      vocab('en-2-2-v2', 'coffee', 'кофе'),
      vocab('en-2-2-v3', 'tea', 'чай'),
      vocab('en-2-2-v4', 'bread', 'хлеб'),
      vocab('en-2-2-v5', 'hungry', 'голодный'),
    ],
    phrases: [
      phrase('en-2-2-p1', 'I would like a coffee, please.', 'Мне кофе, пожалуйста.'),
      phrase('en-2-2-p2', 'Can I have the menu?', 'Можно меню?'),
      phrase('en-2-2-p3', "I'm hungry.", 'Я голоден.'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('en', 'заказ еды и напитков'),
  },
  {
    id: 'en-unit-2-lesson-3',
    unitId: 'en-unit-2',
    languageCode: 'en',
    order: 3,
    title: 'В городе',
    description: 'Учимся спрашивать дорогу и ориентироваться в городе.',
    goal: 'Научиться спрашивать и понимать, как пройти куда-либо.',
    estimatedMinutes: 8,
    xpReward: 10,
    activities: buildActivities('en-unit-2-lesson-3'),
    vocabulary: [
      vocab('en-2-3-v1', 'street', 'улица'),
      vocab('en-2-3-v2', 'shop', 'магазин'),
      vocab('en-2-3-v3', 'left', 'налево'),
      vocab('en-2-3-v4', 'right', 'направо'),
      vocab('en-2-3-v5', 'straight', 'прямо'),
    ],
    phrases: [
      phrase('en-2-3-p1', 'Where is the bus station?', 'Где автобусная станция?'),
      phrase('en-2-3-p2', 'Turn left.', 'Поверни налево.'),
      phrase('en-2-3-p3', 'How can I get to the center?', 'Как мне добраться до центра?'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('en', 'ориентирование в городе'),
  },

  // ---------------------------------------------------------------------
  // Finnish — Unit 1: Знакомство
  // ---------------------------------------------------------------------
  {
    id: 'fi-unit-1-lesson-1',
    unitId: 'fi-unit-1',
    languageCode: 'fi',
    order: 1,
    title: 'Hei ja näkemiin',
    description: 'Учимся здороваться и прощаться на финском.',
    goal: 'Научиться здороваться, прощаться и использовать базовые вежливые слова.',
    estimatedMinutes: 6,
    xpReward: 10,
    activities: buildActivities('fi-unit-1-lesson-1'),
    vocabulary: [
      vocab('fi-1-1-v1', 'hei', 'привет'),
      vocab('fi-1-1-v2', 'hyvää huomenta', 'доброе утро'),
      vocab('fi-1-1-v3', 'hyvää iltaa', 'добрый вечер'),
      vocab('fi-1-1-v4', 'näkemiin', 'до свидания'),
      vocab('fi-1-1-v5', 'kiitos', 'спасибо'),
      vocab('fi-1-1-v6', 'ole hyvä', 'пожалуйста'),
      vocab('fi-1-1-v7', 'kyllä', 'да'),
      vocab('fi-1-1-v8', 'ei', 'нет'),
    ],
    phrases: [
      phrase('fi-1-1-p1', 'Hei, mitä kuuluu?', 'Привет, как дела?'),
      phrase('fi-1-1-p2', 'Hauska tutustua.', 'Приятно познакомиться.'),
      phrase('fi-1-1-p3', 'Nähdään myöhemmin!', 'Увидимся позже!'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('fi', 'приветствия и прощания'),
  },
  {
    id: 'fi-unit-1-lesson-2',
    unitId: 'fi-unit-1',
    languageCode: 'fi',
    order: 2,
    title: 'Mikä sinun nimesi on?',
    description: 'Учимся представляться и рассказывать, откуда мы.',
    goal: 'Научиться представляться и спрашивать имя и происхождение собеседника.',
    estimatedMinutes: 7,
    xpReward: 10,
    activities: buildActivities('fi-unit-1-lesson-2'),
    vocabulary: [
      vocab('fi-1-2-v1', 'nimi', 'имя'),
      vocab('fi-1-2-v2', 'minä olen', 'я (являюсь)'),
      vocab('fi-1-2-v3', 'mistä', 'откуда'),
      vocab('fi-1-2-v4', 'asun', 'я живу'),
    ],
    phrases: [
      phrase('fi-1-2-p1', 'Mikä sinun nimesi on?', 'Как тебя зовут?'),
      phrase('fi-1-2-p2', 'Minun nimeni on Anna.', 'Меня зовут Анна.'),
      phrase('fi-1-2-p3', 'Mistä sinä olet?', 'Откуда ты?'),
      phrase('fi-1-2-p4', 'Olen Venäjältä.', 'Я из России.'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('fi', 'знакомство и представление себя'),
  },
  {
    id: 'fi-unit-1-lesson-3',
    unitId: 'fi-unit-1',
    languageCode: 'fi',
    order: 3,
    title: 'Mitä kuuluu?',
    description: 'Учимся спрашивать о самочувствии и коротко отвечать.',
    goal: 'Научиться спрашивать собеседника о делах и отвечать на этот вопрос.',
    estimatedMinutes: 6,
    xpReward: 10,
    activities: buildActivities('fi-unit-1-lesson-3'),
    vocabulary: [
      vocab('fi-1-3-v1', 'mitä', 'что'),
      vocab('fi-1-3-v2', 'hyvää', 'хорошо'),
      vocab('fi-1-3-v3', 'huonoa', 'плохо'),
      vocab('fi-1-3-v4', 'ihan ok', 'нормально'),
    ],
    phrases: [
      phrase('fi-1-3-p1', 'Mitä kuuluu?', 'Как дела?'),
      phrase('fi-1-3-p2', 'Kiitos hyvää.', 'Спасибо, хорошо.'),
      phrase('fi-1-3-p3', 'Entä sinulle?', 'А у тебя?'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('fi', 'вопросы о самочувствии'),
  },

  // ---------------------------------------------------------------------
  // Finnish — Unit 2: Повседневная жизнь
  // ---------------------------------------------------------------------
  {
    id: 'fi-unit-2-lesson-1',
    unitId: 'fi-unit-2',
    languageCode: 'fi',
    order: 1,
    title: 'Numerot',
    description: 'Учим числа от одного до десяти.',
    goal: 'Выучить числа от одного до десяти и уметь называть свой возраст.',
    estimatedMinutes: 7,
    xpReward: 10,
    activities: buildActivities('fi-unit-2-lesson-1'),
    vocabulary: [
      vocab('fi-2-1-v1', 'yksi', 'один'),
      vocab('fi-2-1-v2', 'kaksi', 'два'),
      vocab('fi-2-1-v3', 'kolme', 'три'),
      vocab('fi-2-1-v4', 'neljä', 'четыре'),
      vocab('fi-2-1-v5', 'viisi', 'пять'),
      vocab('fi-2-1-v6', 'kymmenen', 'десять'),
    ],
    phrases: [
      phrase('fi-2-1-p1', 'Kuinka vanha sinä olet?', 'Сколько тебе лет?'),
      phrase('fi-2-1-p2', 'Olen kaksikymmentä vuotta vanha.', 'Мне двадцать лет.'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('fi', 'числа и возраст'),
  },
  {
    id: 'fi-unit-2-lesson-2',
    unitId: 'fi-unit-2',
    languageCode: 'fi',
    order: 2,
    title: 'Ruoka ja juoma',
    description: 'Учимся заказывать еду и напитки.',
    goal: 'Освоить базовую лексику для заказа еды и напитков в кафе.',
    estimatedMinutes: 7,
    xpReward: 10,
    activities: buildActivities('fi-unit-2-lesson-2'),
    vocabulary: [
      vocab('fi-2-2-v1', 'vesi', 'вода'),
      vocab('fi-2-2-v2', 'kahvi', 'кофе'),
      vocab('fi-2-2-v3', 'tee', 'чай'),
      vocab('fi-2-2-v4', 'leipä', 'хлеб'),
      vocab('fi-2-2-v5', 'nälkä', 'голод'),
    ],
    phrases: [
      phrase('fi-2-2-p1', 'Saisinko kahvin, kiitos.', 'Можно мне кофе, пожалуйста.'),
      phrase('fi-2-2-p2', 'Minulla on nälkä.', 'Я голоден.'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('fi', 'заказ еды и напитков'),
  },
  {
    id: 'fi-unit-2-lesson-3',
    unitId: 'fi-unit-2',
    languageCode: 'fi',
    order: 3,
    title: 'Kaupungissa',
    description: 'Учимся спрашивать дорогу и ориентироваться в городе.',
    goal: 'Научиться спрашивать и понимать, как пройти куда-либо.',
    estimatedMinutes: 8,
    xpReward: 10,
    activities: buildActivities('fi-unit-2-lesson-3'),
    vocabulary: [
      vocab('fi-2-3-v1', 'katu', 'улица'),
      vocab('fi-2-3-v2', 'kauppa', 'магазин'),
      vocab('fi-2-3-v3', 'vasemmalle', 'налево'),
      vocab('fi-2-3-v4', 'oikealle', 'направо'),
      vocab('fi-2-3-v5', 'suoraan', 'прямо'),
    ],
    phrases: [
      phrase('fi-2-3-p1', 'Missä on bussiasema?', 'Где автобусная станция?'),
      phrase('fi-2-3-p2', 'Käänny vasemmalle.', 'Поверни налево.'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('fi', 'ориентирование в городе'),
  },

  // ---------------------------------------------------------------------
  // Swedish — заглушка, будет расширена (см. prompts/11-lesson-ui.md)
  // ---------------------------------------------------------------------
  {
    id: 'sv-unit-1-lesson-1',
    unitId: 'sv-unit-1',
    languageCode: 'sv',
    order: 1,
    title: 'Hej och hejdå',
    description: 'Учимся здороваться и прощаться на шведском.',
    goal: 'Научиться здороваться, прощаться и использовать базовые вежливые слова.',
    estimatedMinutes: 6,
    xpReward: 10,
    activities: buildActivities('sv-unit-1-lesson-1'),
    vocabulary: [
      vocab('sv-1-1-v1', 'hej', 'привет'),
      vocab('sv-1-1-v2', 'god morgon', 'доброе утро'),
      vocab('sv-1-1-v3', 'hejdå', 'пока'),
      vocab('sv-1-1-v4', 'tack', 'спасибо'),
      vocab('sv-1-1-v5', 'ja', 'да'),
      vocab('sv-1-1-v6', 'nej', 'нет'),
    ],
    phrases: [
      phrase('sv-1-1-p1', 'Hej, hur mår du?', 'Привет, как дела?'),
      phrase('sv-1-1-p2', 'Vi ses!', 'Увидимся!'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('sv', 'приветствия и прощания'),
  },

  // ---------------------------------------------------------------------
  // Norwegian — заглушка, будет расширена (см. prompts/11-lesson-ui.md)
  // ---------------------------------------------------------------------
  {
    id: 'no-unit-1-lesson-1',
    unitId: 'no-unit-1',
    languageCode: 'no',
    order: 1,
    title: 'Hei og ha det',
    description: 'Учимся здороваться и прощаться на норвежском.',
    goal: 'Научиться здороваться, прощаться и использовать базовые вежливые слова.',
    estimatedMinutes: 6,
    xpReward: 10,
    activities: buildActivities('no-unit-1-lesson-1'),
    vocabulary: [
      vocab('no-1-1-v1', 'hei', 'привет'),
      vocab('no-1-1-v2', 'god morgen', 'доброе утро'),
      vocab('no-1-1-v3', 'ha det', 'пока'),
      vocab('no-1-1-v4', 'takk', 'спасибо'),
      vocab('no-1-1-v5', 'ja', 'да'),
      vocab('no-1-1-v6', 'nei', 'нет'),
    ],
    phrases: [
      phrase('no-1-1-p1', 'Hei, hvordan går det?', 'Привет, как дела?'),
      phrase('no-1-1-p2', 'Vi sees!', 'Увидимся!'),
    ],
    aiTeacherPrompt: buildAiTeacherPrompt('no', 'приветствия и прощания'),
  },
];

export function getLessonsByUnit(unitId: string): Lesson[] {
  return lessons.filter((lesson) => lesson.unitId === unitId).sort((a, b) => a.order - b.order);
}

export function getLessonsByLanguage(languageCode: LanguageCode): Lesson[] {
  return lessons.filter((lesson) => lesson.languageCode === languageCode);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}
