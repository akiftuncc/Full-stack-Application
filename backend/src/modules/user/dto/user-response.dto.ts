import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: 'abc123', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  surname: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  userName: string;

  @ApiProperty({
    example: '1990-01-01T00:00:00.000Z',
    description: 'Birth date',
  })
  birthDate: Date;

  @ApiProperty({ example: 'USER', description: 'Role' })
  role: Role;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
