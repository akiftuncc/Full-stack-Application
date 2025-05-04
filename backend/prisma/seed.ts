import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { getRandomName, getRandomSurname } from './seed-helpers';
import { LESSONS } from './seed-constants';

const prisma = new PrismaClient();

async function main() {
  // STEP 1: Create admin user
  // STEP 2: Create 50 student users
  // STEP 3: Create 7 lessons
  // STEP 4: Add every student random 3 lessons

  // Add admin user
  const admin = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
  if (!admin) {
    const hash = await bcrypt.hash('admin1', 10);
    await prisma.user.create({
      data: {
        name: 'John',
        surname: 'Doe',
        userName: 'admin1',
        password: hash,
        birthDate: new Date(1990, 0, 1),
        role: Role.ADMIN,
      },
    });
    console.log('Seeded default admin (username: admin1, pass: admin1)\n');
  }

  // Add 50 student users
  const studentsToCreate = 50;
  const student = await prisma.user.findFirst({ where: { role: Role.USER } });
  if (!student) {
    async function generatePassword(password: string) {
      return await bcrypt.hash(password, 10);
    }

    for (let i = 0; i < studentsToCreate; i++) {
      await prisma.user.create({
        data: {
          name: getRandomName(),
          surname: getRandomSurname(),
          userName: `student${i + 1}`,
          password: await generatePassword(`student${i + 1}`),
          birthDate: new Date(1990 + Math.floor(i / 10), i % 12, 1 + (i % 28)),
          role: Role.USER,
        },
      });
    }
    console.log(
      `Seeded ${studentsToCreate} student users (usernames: student1-${studentsToCreate}, passwords: student1-${studentsToCreate})\n
      example ->   username: student1, password: student1 // username: student${studentsToCreate}, password: student${studentsToCreate}`,
    );
  }

  // Create lessons
  const lesson = await prisma.lesson.findFirst();
  if (!lesson) {
    for (let i = 0; i < LESSONS.length; i++) {
      await prisma.lesson.create({
        data: {
          name: LESSONS[i].name,
          duration: LESSONS[i].duration,
          level: LESSONS[i].level,
          status: LESSONS[i].status,
        },
      });
    }
    console.log(`Seeded ${LESSONS.length} lessons.\n`);
  }

  // Add every student random 7 lessons
  const lessonCount = 7;
  const pivotUserLesson = await prisma.pivotUserLesson.findFirst();
  if (!pivotUserLesson) {
    const students = await prisma.user.findMany({ where: { role: Role.USER } });
    const lessons = await prisma.lesson.findMany();
    for (const student of students) {
      const randomLessons = lessons
        .sort(() => Math.random() - 0.5)
        .slice(0, lessonCount);
      const pivotUserLessonData = randomLessons.map((lesson) => {
        return {
          userId: student.id,
          lessonId: lesson.id,
        };
      });
      await prisma.pivotUserLesson.createMany({
        data: pivotUserLessonData,
      });
    }
    console.log(
      `Seeded ${students.length} student users to ${lessonCount} random lessons.\n`,
    );
  }
}

main().finally(() => prisma.$disconnect());
