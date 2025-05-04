import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const LessonUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  surname: z.string(),
  userName: z.string(),
});

export class LessonUserDto extends createZodDto(LessonUserSchema) {
  @ApiProperty({ example: 'cma5jfhei0001c8u9u0iz8uul' })
  id: string;

  @ApiProperty({ example: 'Matthew' })
  name: string;

  @ApiProperty({ example: 'Martinez' })
  surname: string;

  @ApiProperty({ example: 'student1' })
  userName: string;
}

export const UserLessonItemSchema = z.object({
  assignedAt: z.string().or(z.date()),
  user: LessonUserSchema,
});

export class UserLessonItemDto extends createZodDto(UserLessonItemSchema) {
  @ApiProperty({ example: '2025-05-01T15:46:42.307Z' })
  assignedAt: string | Date;

  @ApiProperty({ type: LessonUserDto })
  user: LessonUserDto;
}

export const UserListOfLessonSchema = z.object({
  data: z.array(UserLessonItemSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export class UserListOfLessonDto extends createZodDto(UserListOfLessonSchema) {
  @ApiProperty({ type: [UserLessonItemDto] })
  data: UserLessonItemDto[];

  @ApiProperty({
    example: {
      total: 17,
      page: 1,
      limit: 10,
      totalPages: 2,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
