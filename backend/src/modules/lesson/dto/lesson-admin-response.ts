import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { Level, Status } from '@prisma/client';

export const LessonAdminResponseSchema = z.object({
  name: z.string(),
  level: z.nativeEnum(Level),
  duration: z.number(),
  status: z.nativeEnum(Status),
  createdAt: z.date(),
  updatedAt: z.date(),
  students: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      surname: z.string(),
      userName: z.string(),
    }),
  ),
});

export class LessonUserDto {
  id: string;
  name: string;
  surname: string;
  userName: string;
}

export class LessonAdminResponseDto extends createZodDto(
  LessonAdminResponseSchema,
) {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Mathematics' })
  name: string;

  @ApiProperty({ example: 10 })
  duration: number;

  @ApiProperty({ example: Level.BEGINNER })
  level: Level;

  @ApiProperty({ example: Status.ACTIVE })
  status: Status;

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  updatedAt: Date;

  @ApiProperty({ type: [LessonUserDto] })
  students: LessonUserDto[];
}
