import { Lesson, PivotUserLesson, User } from '@prisma/client';

export type StudentTable = User & {
  pivotUserLesson: (PivotUserLesson & {
    lesson: Lesson;
  })[];
};

export type LessonTable = Lesson & {
  pivotUserLesson: (PivotUserLesson & {
    user: User;
  })[];
};
