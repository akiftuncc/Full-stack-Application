import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { Level, Status } from '@prisma/client';

export const CreateLessonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  level: z.nativeEnum(Level),
  duration: z.number().int().min(1, 'Duration must be at least 1'),
  status: z.nativeEnum(Status),
});

export class CreateLessonDto extends createZodDto(CreateLessonSchema) {
  @ApiProperty({ example: 'Mathematics' })
  name: string;

  @ApiProperty({ example: 10 })
  duration: number;

  @ApiProperty({ example: Level.BEGINNER })
  level: Level;

  @ApiProperty({ example: Status.ACTIVE })
  status: Status;
}
