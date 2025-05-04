import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  LessonResponseDto,
  LessonsResponseDto,
} from './dto/lesson-response.dto';
import { LessonAdminResponseDto } from './dto/lesson-admin-response';
import { IdRequestDto } from '@/common/dto/id-request.dto';
import { MessageResponseDto } from '@/common/dto/message-response';
import { UserListOfLessonDto } from './dto/user-listof-lesson.dto';

@ApiTags('Lessons')
@UseGuards(JwtAuthGuard)
@Controller('lessons')
@ApiBearerAuth()
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  // admins can request too but returns empty array
  @ApiOperation({ summary: 'Get registered lessons' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of registered lessons',
    type: LessonResponseDto,
  })
  @Get('registered')
  @UsePipes(ZodValidationPipe)
  async getRegisteredLessons(
    @Query() pagination: PaginationDto,
    @Request() req,
  ): Promise<LessonsResponseDto> {
    return await this.lessonService.getRegisteredLessons(
      pagination,
      req.user.id,
    );
  }

  // Routes available to all authenticated users
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of lessons with pagination',
    type: [LessonResponseDto],
  })
  @Get()
  async getLessons(
    @Query() pagination: PaginationDto,
    @Request() req,
  ): Promise<LessonsResponseDto> {
    return await this.lessonService.getLessons(pagination, req.user?.id);
  }

  @ApiOperation({ summary: 'Get lesson by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson details',
    type: LessonResponseDto,
  })
  @Get(':id')
  async getLesson(
    @Param('id') id: string,
    @Request() req,
  ): Promise<LessonResponseDto> {
    return await this.lessonService.getLesson(id, req.user?.id);
  }

  // User only routes
  @ApiOperation({ summary: 'Register for a lesson (User)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Registered for lesson successfully',
  })
  @Post('register')
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @UsePipes(ZodValidationPipe)
  async registerLesson(
    @Request() req,
    @Body() idRequestDto: IdRequestDto,
  ): Promise<MessageResponseDto> {
    return await this.lessonService.registerLesson(
      req.user.id,
      idRequestDto.id,
    );
  }

  @ApiOperation({ summary: 'Unregister from a lesson (User)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unregistered from lesson successfully',
  })
  @Delete('unregister/:lessonId')
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  async unregisterLesson(@Request() req, @Param('lessonId') lessonId: string) {
    return await this.lessonService.unregisterLesson(req.user.id, lessonId);
  }

  // Admin only routes
  @ApiOperation({ summary: 'Create a new lesson (Admin)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Lesson created successfully',
    type: LessonAdminResponseDto,
  })
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(ZodValidationPipe)
  async createLesson(
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<LessonAdminResponseDto> {
    return await this.lessonService.createLesson(createLessonDto);
  }

  @ApiOperation({ summary: 'Update a lesson (Admin)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson updated successfully',
    type: LessonAdminResponseDto,
  })
  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(ZodValidationPipe)
  async updateLesson(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<LessonAdminResponseDto> {
    return await this.lessonService.updateLesson(id, updateLessonDto);
  }

  @ApiOperation({ summary: 'Delete a lesson (Admin)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson deleted successfully',
  })
  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  async deleteLesson(@Param('id') id: string): Promise<MessageResponseDto> {
    return await this.lessonService.softDeleteLesson(id);
  }

  @ApiOperation({ summary: 'Get users in a lesson (Admin)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users in a lesson with pagination',
  })
  @Get(':id/users')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getLessonUsers(
    @Param('id') id: string,
    @Query() pagination: PaginationDto,
  ): Promise<UserListOfLessonDto> {
    return await this.lessonService.getLessonUsers(id, pagination);
  }
}
