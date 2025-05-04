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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {
  StudentResponseDto,
  StudentsResponseDto,
} from './dto/student-response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('Students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('students')
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // Admin routes
  @ApiOperation({ summary: 'Get all students (Admin)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of students with pagination',
    type: [StudentsResponseDto],
  })
  @Get()
  async getStudents(
    @Query() pagination: PaginationDto,
  ): Promise<StudentsResponseDto> {
    return await this.studentService.getStudents(pagination);
  }

  @ApiOperation({ summary: 'Get student by id (Admin)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student details',
    type: StudentResponseDto,
  })
  @Get(':id')
  async getStudent(@Param('id') id: string): Promise<StudentResponseDto> {
    return await this.studentService.getStudent(id);
  }

  @ApiOperation({ summary: 'Create a new student (Admin)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Student created successfully',
    type: StudentResponseDto,
  })
  @Post()
  @UsePipes(ZodValidationPipe)
  async createStudent(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    return await this.studentService.createStudent(createStudentDto);
  }

  @ApiOperation({ summary: 'Update a student (Admin)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student updated successfully',
    type: StudentResponseDto,
  })
  @Patch(':id')
  @UsePipes(ZodValidationPipe)
  async updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return await this.studentService.updateStudent(id, updateStudentDto);
  }

  @ApiOperation({ summary: 'Delete a student (Admin)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student deleted successfully',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteStudent(@Param('id') id: string) {
    return await this.studentService.softDeleteStudent(id);
  }
}
