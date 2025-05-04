import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const MessageResponseSchema = z.object({
  message: z.string(),
});

export class MessageResponseDto extends createZodDto(MessageResponseSchema) {
  @ApiProperty({ example: 'Message' })
  message: string;
}
