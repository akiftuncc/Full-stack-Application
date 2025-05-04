import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const LoginSchema = z.object({
  userName: z.string().min(6, 'Username is required'),
  password: z.string().min(6, 'Password is required'),
});

export class LoginDto extends createZodDto(LoginSchema) {
  @ApiProperty({ example: 'johndoe', description: 'Username' })
  userName: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  password: string;
}
