import { getLessonById } from '@/data/lessons';
import { verifyToken } from '@clerk/backend';
import { StreamClient } from '@stream-io/node-sdk';

const CALL_TYPE = 'default';

function buildCallId(lessonId: string, userId: string): string {
  return `lesson-${lessonId}-${userId}`;
}

export async function POST(request: Request) {
  const bearerToken = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!bearerToken) {
    return Response.json({ error: 'Не авторизован.' }, { status: 401 });
  }

  let userId: string;
  try {
    const verified = await verifyToken(bearerToken, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    userId = verified.sub;
  } catch {
    return Response.json({ error: 'Сессия недействительна.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const lessonId = body?.lessonId;

  if (typeof lessonId !== 'string') {
    return Response.json({ error: 'lessonId обязателен.' }, { status: 400 });
  }

  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return Response.json({ error: 'Урок не найден.' }, { status: 404 });
  }

  const apiKey = process.env.STREAM_API_KEY!;
  const streamClient = new StreamClient(apiKey, process.env.STREAM_API_SECRET!);

  const callId = buildCallId(lesson.id, userId);

  await streamClient.upsertUsers([{ id: userId }]);

  await streamClient.video.call(CALL_TYPE, callId).getOrCreate({
    data: {
      created_by_id: userId,
      members: [{ user_id: userId }],
      custom: {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        languageCode: lesson.languageCode,
        aiTeacherPrompt: lesson.aiTeacherPrompt,
      },
    },
  });

  const token = streamClient.generateUserToken({ user_id: userId, validity_in_seconds: 60 * 60 });

  return Response.json({ apiKey, token, userId, callId, callType: CALL_TYPE });
}
