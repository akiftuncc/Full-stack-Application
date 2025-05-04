import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import {
  StudentResponseDto,
  StudentsResponseDto,
} from './dto/student-response.dto';
import { normalizeStudent } from './helpers/normalizers';
import { StudentTable } from '@/common/types/prisma-types';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getStudents(pagination: PaginationDto): Promise<StudentsResponseDto> {
    const { page = 1, limit = 10 } = {
      page: Number(pagination.page),
      limit: Number(pagination.limit),
    };
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { deletedAt: null, role: Role.USER },
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          surname: true,
          birthDate: true,
          userName: true,
          createdAt: true,
          updatedAt: true,
          pivotUserLesson: {
            include: {
              lesson: true,
            },
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count({
        where: { deletedAt: null, role: Role.USER },
      }),
    ]);

    const normalizedStudents = students.map(normalizeStudent);

    return {
      data: normalizedStudents,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStudent(id: string): Promise<StudentResponseDto> {
    const student = await this.prisma.user.findFirst({
      where: { id, deletedAt: null, role: Role.USER },
      select: {
        id: true,
        name: true,
        surname: true,
        birthDate: true,
        userName: true,
        createdAt: true,
        updatedAt: true,
        pivotUserLesson: {
          include: {
            lesson: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    const normalizedStudent = normalizeStudent(student as StudentTable);

    return {
      data: normalizedStudent,
    };
  }

  async createStudent(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    const existingUser = await this.prisma.user.findFirst({
      where: { userName: createStudentDto.userName },
    });

    if (existingUser) {
      throw new BadRequestException(
        'This username is already taken, please choose another one',
      );
    }

    if (createStudentDto.birthDate) {
      if (new Date(createStudentDto.birthDate) > new Date()) {
        throw new BadRequestException('Birth date cannot be in the future');
      }
    }

    const student = await this.prisma.user.create({
      data: {
        ...createStudentDto,
        password: hashedPassword,
        role: Role.USER,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        birthDate: true,
        userName: true,
        createdAt: true,
        updatedAt: true,
        pivotUserLesson: {
          include: {
            lesson: true,
          },
        },
      },
    });

    const normalizedStudent = normalizeStudent(student as StudentTable);

    return {
      data: normalizedStudent,
    };
  }

  private async checkUserName(id: string, updateProfileDto: UpdateStudentDto) {
    if (updateProfileDto.userName) {
      const user = await this.prisma.user.findFirst({
        where: { id },
      });

      if (!(user?.userName === updateProfileDto.userName)) {
        const isUserNameTaken = await this.prisma.user.findFirst({
          where: { userName: updateProfileDto.userName, deletedAt: null },
        });

        if (isUserNameTaken) {
          throw new BadRequestException(
            'This username is already taken, please choose another one',
          );
        }
      }
    }
  }

  async updateStudent(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    await this.getStudent(id);

    await this.checkUserName(id, updateStudentDto);

    if (updateStudentDto.birthDate) {
      if (new Date(updateStudentDto.birthDate) > new Date()) {
        throw new BadRequestException('Birth date cannot be in the future');
      }
    }

    if (updateStudentDto.password) {
      updateStudentDto.password = await bcrypt.hash(
        updateStudentDto.password,
        10,
      );
    }

    const updatedStudent = await this.prisma.user.update({
      where: { id },
      data: updateStudentDto,
      select: {
        id: true,
        name: true,
        surname: true,
        birthDate: true,
        userName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        pivotUserLesson: {
          include: {
            lesson: true,
          },
        },
      },
    });

    const normalizedStudent = normalizeStudent(updatedStudent as StudentTable);

    return {
      data: normalizedStudent,
    };
  }

  async softDeleteStudent(id: string) {
    await this.getStudent(id);

    await this.prisma.$transaction(async (prisma) => {
      await prisma.pivotUserLesson.deleteMany({
        where: { userId: id },
      });

      await prisma.user.update({
        where: { id },
        data: {
          id: id + '_deleted_' + new Date().getTime(),
          deletedAt: new Date(),
        },
      });
    });

    return { message: 'Student deleted successfully' };
  }
}
