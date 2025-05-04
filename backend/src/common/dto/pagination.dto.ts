import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const PaginationSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
});

export class PaginationDto extends createZodDto(PaginationSchema) {
  @ApiProperty({ example: '1', required: false })
  page: string;

  @ApiProperty({ example: '10', required: false })
  limit: string;
}
