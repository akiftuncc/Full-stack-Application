"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lessonsApi } from "@/lib/api/lessons-api";
import ProfileSkeleton from "@/components/skeletons/profile";
import TableRowSkeleton from "@/components/skeletons/lessons";
import { LessonLevel, LessonStatus } from "@/lib/constants/enums";
import { UserIcon } from "lucide-react";

interface LessonInfoProps {
  lessonId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LessonInfo({
  lessonId,
  isOpen,
  onClose,
}: LessonInfoProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    data: lesson,
    isLoading: isLessonLoading,
    isError: isLessonError,
    error: lessonError,
  } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => lessonsApi.getLesson(lessonId),
    enabled: isOpen && !!lessonId && activeTab === "details",
  });

  const {
    data: lessonUsers,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ["lessonUsers", lessonId, currentPage, limit],
    queryFn: () => lessonsApi.getLessonUsers(lessonId, currentPage, limit),
    enabled: isOpen && !!lessonId && activeTab === "students",
  });

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLessonLoading && activeTab === "details") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <ProfileSkeleton />
        </DialogContent>
      </Dialog>
    );
  }

  if (isLessonError && activeTab === "details") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="text-red-500">
            {lessonError instanceof Error
              ? lessonError.message
              : "Failed to load lesson information"}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Lesson Information</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="cursor-pointer">
              Details
            </TabsTrigger>
            <TabsTrigger value="students" className="cursor-pointer">
              Students
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="py-4">
            {lesson && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4">
                  <img
                    src="/each-book.png"
                    alt="Lesson book"
                    className="w-full h-full object-contain"
                  />
                </div>

                <h2 className="text-xl font-semibold mb-4">{lesson.name}</h2>

                <div className="text-left space-y-3 mt-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span>{lesson.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration:</span>
                    <span>{lesson.duration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Level:</span>
                    <span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          lesson.level === LessonLevel.BEGINNER
                            ? "bg-blue-100 text-blue-800"
                            : lesson.level === LessonLevel.INTERMEDIATE
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {getLevelLabel(lesson.level)}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          lesson.status === LessonStatus.ACTIVE
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getStatusLabel(lesson.status)}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span>{format(new Date(lesson.createdAt), "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated:</span>
                    <span>{format(new Date(lesson.updatedAt), "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Students Enrolled:</span>
                    <span>{lesson._count.users || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="students" className="py-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Surname</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Enrolled On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isUsersLoading ? (
                    Array.from({ length: limit }).map((_, index) => (
                      <TableRowSkeleton key={index} />
                    ))
                  ) : isUsersError ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-10 text-red-500"
                      >
                        Error loading students: {(usersError as Error).message}
                      </TableCell>
                    </TableRow>
                  ) : !lessonUsers || lessonUsers.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        No students enrolled in this lesson
                      </TableCell>
                    </TableRow>
                  ) : (
                    lessonUsers.data.map((item) => (
                      <TableRow key={item.user.id}>
                        <TableCell>
                          <div className="flex justify-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <UserIcon size={16} className="text-gray-500" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.user.name}</TableCell>
                        <TableCell>{item.user.surname}</TableCell>
                        <TableCell>{item.user.userName}</TableCell>
                        <TableCell>
                          {format(new Date(item.assignedAt), "dd/MM/yyyy")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!isUsersLoading &&
              !isUsersError &&
              lessonUsers &&
              lessonUsers.meta.totalPages > 0 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    Previous
                  </Button>

                  {Array.from(
                    { length: lessonUsers.meta.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="cursor-pointer"
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === lessonUsers.meta.totalPages}
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
