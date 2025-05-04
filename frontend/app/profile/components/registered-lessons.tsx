import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lesson } from "@/types/lesson";
import { LessonLevel, LessonStatus } from "@/lib/constants/enums";
import Link from "next/link";
import RegisteredLessonSkeleton from "@/components/skeletons/registered-lesson";
import { BookOpen, AlertCircle } from "lucide-react";

interface RegisteredLessonsProps {
  lessons: Lesson[];
  isLoading: boolean;
  isError: boolean;
  onUnregister: (lessonId: string) => void;
}

export function RegisteredLessons({
  lessons,
  isLoading,
  isError,
  onUnregister,
}: RegisteredLessonsProps) {
  const getLevelLabel = (level: LessonLevel) => {
    const labels = {
      [LessonLevel.BEGINNER]: "Beginner",
      [LessonLevel.INTERMEDIATE]: "Intermediate",
      [LessonLevel.ADVANCED]: "Advanced",
    };
    return labels[level];
  };

  const getStatusLabel = (status: LessonStatus) => {
    const labels = {
      [LessonStatus.ACTIVE]: "Active",
      [LessonStatus.INACTIVE]: "Inactive",
    };
    return labels[status];
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>My Registered Lessons</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <RegisteredLessonSkeleton key={index} />
              ))}
            </TableBody>
          </Table>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Error: Failed to fetch registered lessons
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p>You haven't registered for any lessons yet.</p>
            <Button className="mt-4" size="sm" variant="outline">
              <Link href="/lessons">Browse Lessons</Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell>
                    <div className="w-8 h-8 bg-primary/10 dark:bg-primary/5 rounded flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{lesson.name}</TableCell>
                  <TableCell>{lesson.duration}h</TableCell>
                  <TableCell>{getLevelLabel(lesson.level)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        lesson.status === LessonStatus.ACTIVE
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {getStatusLabel(lesson.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => onUnregister(lesson.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Unregister
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
