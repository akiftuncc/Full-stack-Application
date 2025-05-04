import { Lesson, User } from '@prisma/client';
import { LessonResponseDto } from '../dto/lesson-response.dto';
import { LessonAdminResponseDto } from '../dto/lesson-admin-response';

export type LessonWithPivotUserLesson = Lesson & {
  _count: { pivotUserLesson: number };
  pivotUserLesson: { userId: string }[];
};

export const normalizeLesson = (
  lesson: LessonWithPivotUserLesson,
): LessonResponseDto => {
  const { _count, deletedAt, pivotUserLesson, ...rest } = lesson;
  return {
    ...rest,
    _count: { users: _count.pivotUserLesson },
    isRegistered: pivotUserLesson.some(({ userId }) => userId === userId),
  };
};

export const normalizeLessonAdmin = (
  lesson: Lesson & { pivotUserLesson: { user: User }[] },
): LessonAdminResponseDto => {
  const { deletedAt, pivotUserLesson, ...rest } = lesson;
  return {
    ...rest,
    students: pivotUserLesson.map(({ user }) => ({
      id: user.id,
      name: user.name,
      surname: user.surname,
      userName: user.userName,
    })),
  };
};
