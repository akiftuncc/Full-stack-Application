import { ApiProperty } from '@nestjs/swagger';
import { Level, Status } from '@prisma/client';

export class LessonDto {
  @ApiProperty({ example: 'abc123', description: 'Lesson ID' })
  id: string;

  @ApiProperty({ example: 'Mathematics', description: 'Lesson name' })
  name: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  duration: number;

  @ApiProperty({ example: 'BEGINNER', description: 'Lesson level' })
  level: Level;

  @ApiProperty({ example: 'ACTIVE', description: 'Lesson status' })
  status: Status;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class UserDto {
  @ApiProperty({ example: 'abc123', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  surname: string;

  @ApiProperty({
    example: '1990-01-01T00:00:00.000Z',
    description: 'Birth date',
  })
  birthDate: Date;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  userName: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ type: [LessonDto], description: 'Assigned lessons' })
  lessons: LessonDto[];
}

export class StudentsResponseDto {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];

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

export class StudentResponseDto {
  @ApiProperty({ type: UserDto })
  data: UserDto;
}
