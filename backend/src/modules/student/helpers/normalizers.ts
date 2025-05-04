import { UserDto } from '../dto/student-response.dto';
import { StudentTable } from '@/common/types/prisma-types';

export function normalizeStudent(student: StudentTable): UserDto {
  const { pivotUserLesson, role, ...rest } = student;
  return {
    ...rest,
    lessons: pivotUserLesson.map((pivot) => ({
      id: pivot.lesson.id,
      name: pivot.lesson.name,
      duration: pivot.lesson.duration,
      level: pivot.lesson.level,
      status: pivot.lesson.status,
      createdAt: pivot.lesson.createdAt,
      updatedAt: pivot.lesson.updatedAt,
    })),
  };
}
