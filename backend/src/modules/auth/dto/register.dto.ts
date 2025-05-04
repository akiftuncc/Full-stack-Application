import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  birthDate: z.string().datetime(),
  userName: z.string().min(6, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(Role),
});

export class RegisterDto extends createZodDto(RegisterSchema) {
  @ApiProperty({ example: 'John', description: 'First name' })
  name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  surname: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  userName: string;

  @ApiProperty({
    example: '1990-01-01T00:00:00.000Z',
    description: 'Birth date',
  })
  birthDate: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  password: string;

  @ApiProperty({ example: 'USER', description: 'Role' })
  role: Role;
}
