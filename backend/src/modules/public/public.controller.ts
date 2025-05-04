import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicService } from './public.service';

@ApiTags('Public')
@Controller('')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @ApiOperation({ summary: 'Get greeting message' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a greeting message',
  })
  @Get()
  async getGreeting() {
    return this.publicService.getGreeting();
  }

  @ApiOperation({ summary: 'Get first 3 lessons sorted alphabetically' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns first 3 lessons sorted alphabetically',
  })
  @Get('public-lessons')
  async getTopLessons() {
    return this.publicService.getTopLessons();
  }
}
