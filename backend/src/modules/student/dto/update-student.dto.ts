import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export const UpdateStudentSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  surname: z.string().min(1, 'Surname is required').optional(),
  birthDate: z.string().datetime().optional(),
  userName: z.string().min(6, 'Username is required').optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  role: z.nativeEnum(Role).optional(),
});

export class UpdateStudentDto extends createZodDto(UpdateStudentSchema) {
  @ApiProperty({ example: 'John', description: 'First name', required: false })
  name?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  surname?: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username',
    required: false,
  })
  userName?: string;

  @ApiProperty({
    example: '1990-01-01T00:00:00.000Z',
    description: 'Birth date',
    required: false,
  })
  birthDate?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password',
    required: false,
  })
  password?: string;

  @ApiProperty({ example: 'USER', description: 'Role', required: false })
  role?: Role;
}
