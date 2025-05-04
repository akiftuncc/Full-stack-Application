import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const LessonResponseSchema = z.object({
  id: z.string(),
  level: z.string(),
  duration: z.number(),
  name: z.string(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    users: z.number(),
  }),
  isRegistered: z.boolean().optional(),
});

export class LessonResponseDto extends createZodDto(LessonResponseSchema) {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Mathematics' })
  name: string;

  @ApiProperty({ example: 10 })
  duration: number;

  @ApiProperty({ example: 'BEGINNER' })
  level: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  updatedAt: Date;

  @ApiProperty({ example: { users: 10 } })
  _count: {
    users: number;
  };

  @ApiProperty({ example: true })
  isRegistered: boolean;
}

export const LessonsResponseSchema = z.object({
  data: z.array(LessonResponseSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export class LessonsResponseDto extends createZodDto(LessonsResponseSchema) {
  @ApiProperty({ type: [LessonResponseDto] })
  data: LessonResponseDto[];

  @ApiProperty({
    example: {
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
