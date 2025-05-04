import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const IdRequestSchema = z.object({
  id: z.string().cuid('ID must be a valid UUID'),
});

export class IdRequestDto extends createZodDto(IdRequestSchema) {
  @ApiProperty({ example: 'cjld2cjxh0000qzrmn831i7rn' })
  id: string;
}
