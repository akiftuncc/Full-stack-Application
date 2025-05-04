import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async getGreeting(): Promise<{ message: string }> {
    return { message: 'Hi from Online School' };
  }

  async getTopLessons() {
    const lessons = await this.prisma.lesson.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        level: true,
        duration: true,
        status: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 5,
    });

    return {
      data: lessons,
    };
  }
}
