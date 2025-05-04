import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Lesson, Role, User } from '@prisma/client';
import {
  LessonWithPivotUserLesson,
  normalizeLesson,
  normalizeLessonAdmin,
} from './helpers/normalizers';
import {
  LessonResponseDto,
  LessonsResponseDto,
} from './dto/lesson-response.dto';
import { MessageResponseDto } from '@/common/dto/message-response';
import { LessonAdminResponseDto } from './dto/lesson-admin-response';
import { UserListOfLessonDto } from './dto/user-listof-lesson.dto';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  private async getLessonHelper(id: string): Promise<boolean> {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id, deletedAt: null },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return true;
  }

  async getLessons(
    pagination: PaginationDto,
    userId?: string,
  ): Promise<LessonsResponseDto> {
    const { page = 1, limit = 10 } = {
      page: Number(pagination.page),
      limit: Number(pagination.limit),
    };
    const skip = (page - 1) * limit;

    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          status: true,
          level: true,
          duration: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          _count: {
            select: { pivotUserLesson: true },
          },
          pivotUserLesson: userId
            ? {
                where: { userId },
                select: { userId: true },
              }
            : undefined,
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.lesson.count({
        where: { deletedAt: null },
      }),
    ]);

    const normalizedLessons = lessons.map(normalizeLesson);

    return {
      data: normalizedLessons,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLesson(id: string, userId: string): Promise<LessonResponseDto> {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        name: true,
        status: true,
        level: true,
        duration: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        _count: {
          select: { pivotUserLesson: true },
        },
        pivotUserLesson: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : undefined,
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    const normalizedLesson = normalizeLesson(
      lesson as Lesson & {
        _count: { pivotUserLesson: number };
        pivotUserLesson: { userId: string }[];
      },
    );

    return normalizedLesson;
  }

  async getRegisteredLessons(
    pagination: PaginationDto,
    userId: string,
  ): Promise<LessonsResponseDto> {
    const { page = 1, limit = 10 } = {
      page: Number(pagination.page),
      limit: Number(pagination.limit),
    };
    const skip = (page - 1) * limit;

    const [lessons, total] = await Promise.all([
      this.prisma.pivotUserLesson.findMany({
        where: { userId, lesson: { deletedAt: null } },
        select: {
          lesson: {
            select: {
              id: true,
              name: true,
              status: true,
              level: true,
              duration: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
              _count: {
                select: { pivotUserLesson: true },
              },
              pivotUserLesson: userId
                ? {
                    where: { userId },
                    select: { userId: true },
                  }
                : undefined,
            },
          },
        },
        orderBy: {
          lesson: {
            name: 'asc',
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.pivotUserLesson.count({
        where: { userId, lesson: { deletedAt: null } },
      }),
    ]);

    const normalizedLessons = lessons.map((item) =>
      normalizeLesson(item.lesson as LessonWithPivotUserLesson),
    );

    return {
      data: normalizedLessons,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async registerLesson(
    userId: string,
    lessonId: string,
  ): Promise<MessageResponseDto> {
    await this.getLessonHelper(lessonId);

    const existingRegistration = await this.prisma.pivotUserLesson.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    if (existingRegistration) {
      throw new ForbiddenException(
        'User is already registered for this lesson',
      );
    }

    await this.prisma.pivotUserLesson.create({
      data: {
        userId,
        lessonId,
      },
    });

    return { message: 'Successfully registered for the lesson' };
  }

  async unregisterLesson(
    userId: string,
    lessonId: string,
  ): Promise<MessageResponseDto> {
    await this.getLessonHelper(lessonId);

    const existingRegistration = await this.prisma.pivotUserLesson.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    if (!existingRegistration) {
      throw new ForbiddenException('User is not registered for this lesson');
    }

    await this.prisma.pivotUserLesson.delete({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    return { message: 'Successfully unregistered from the lesson' };
  }

  async createLesson(
    createLessonDto: CreateLessonDto,
  ): Promise<LessonAdminResponseDto> {
    try {
      const lesson = await this.prisma.lesson.create({
        data: {
          ...createLessonDto,
        },
        select: {
          id: true,
          name: true,
          status: true,
          level: true,
          duration: true,
          createdAt: true,
          updatedAt: true,
          pivotUserLesson: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                  userName: true,
                },
              },
            },
          },
        },
      });

      const normalizedLesson = normalizeLessonAdmin(
        lesson as Lesson & { pivotUserLesson: { user: User }[] },
      );

      return normalizedLesson;
    } catch {
      throw new BadRequestException('Lesson already exists');
    }
  }

  async updateLesson(
    id: string,
    updateLessonDto: UpdateLessonDto,
  ): Promise<LessonAdminResponseDto> {
    await this.getLessonHelper(id);

    try {
      const updatedLesson = await this.prisma.lesson.update({
        where: { id, deletedAt: null },
        data: updateLessonDto,
        select: {
          id: true,
          name: true,
          status: true,
          level: true,
          duration: true,
          createdAt: true,
          updatedAt: true,
          pivotUserLesson: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                  userName: true,
                },
              },
            },
          },
        },
      });

      const normalizedLesson = normalizeLessonAdmin(
        updatedLesson as Lesson & { pivotUserLesson: { user: User }[] },
      );

      return normalizedLesson;
    } catch {
      throw new BadRequestException('Lesson name already exists');
    }
  }

  async softDeleteLesson(id: string): Promise<MessageResponseDto> {
    await this.getLessonHelper(id);

    await this.prisma.$transaction(async (prisma) => {
      await prisma.pivotUserLesson.deleteMany({
        where: { lessonId: id },
      });
      await prisma.lesson.update({
        where: { id },
        data: {
          id: id + '_deleted_' + new Date().getTime(),
          deletedAt: new Date(),
        },
      });
    });

    return { message: 'Lesson deleted successfully' };
  }

  async getLessonUsers(
    lessonId: string,
    pagination: PaginationDto,
  ): Promise<UserListOfLessonDto> {
    await this.getLessonHelper(lessonId);

    const { page = 1, limit = 10 } = {
      page: Number(pagination.page),
      limit: Number(pagination.limit),
    };
    const skip = (page - 1) * limit;

    const [lessonUsers, total] = await Promise.all([
      this.prisma.pivotUserLesson.findMany({
        where: { lessonId, user: { deletedAt: null } },
        orderBy: {
          assignedAt: 'desc',
        },

        select: {
          assignedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              userName: true,
            },
          },
        },

        skip,
        take: limit,
      }),
      this.prisma.pivotUserLesson.count({
        where: { lessonId, user: { deletedAt: null } },
      }),
    ]);

    return {
      data: lessonUsers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
