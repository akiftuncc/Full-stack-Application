import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { Level, Status } from '@prisma/client';

export const UpdateLessonSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  level: z.nativeEnum(Level).optional(),
  duration: z.number().optional(),
  status: z.nativeEnum(Status).optional(),
});

export class UpdateLessonDto extends createZodDto(UpdateLessonSchema) {
  @ApiProperty({ example: 'Mathematics', required: false })
  name?: string;

  @ApiProperty({ example: Level.BEGINNER, required: false })
  level?: Level;

  @ApiProperty({ example: 10, required: false })
  duration?: number;

  @ApiProperty({ example: Status.INACTIVE, required: false })
  status?: Status;
}
