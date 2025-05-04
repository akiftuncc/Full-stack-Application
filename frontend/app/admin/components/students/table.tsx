"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StudentSkeleton from "@/components/skeletons/students";
import { studentApi } from "@/lib/api/student";
import { Student } from "@/types/student";
import UpdateStudent from "./update-student";
import StudentProfile from "./student-profile";

interface StudentsTableProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function StudentsTable({
  currentPage,
  setCurrentPage,
}: StudentsTableProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const limit = 10;

  const {
    data: studentsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["students", currentPage, limit],
    queryFn: () => studentApi.getStudents(currentPage, limit),
  });

  const deleteStudentMutation = useMutation({
    mutationFn: studentApi.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const students = studentsData?.data || [];
  const totalPages = studentsData?.meta?.totalPages || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsUpdateModalOpen(true);
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setIsProfileModalOpen(true);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudentMutation.mutate(studentId);
    }
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedStudent(null);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Surname</TableHead>
              <TableHead>Birth Date</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, index) => (
                <StudentSkeleton key={index} />
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-destructive"
                >
                  Error loading students: {(error as Error).message}
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student: Student) => (
                <TableRow
                  key={student.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewProfile(student)}
                >
                  <TableCell className="text-foreground">
                    {student.id}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {student.name}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {student.surname}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {format(new Date(student.birthDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {student.userName}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStudent(student);
                        }}
                        className="cursor-pointer"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStudent(student.id);
                        }}
                        className="cursor-pointer"
                        disabled={deleteStudentMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !isError && totalPages > 0 && (
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

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      )}

      {selectedStudent && (
        <UpdateStudent
          student={selectedStudent}
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
        />
      )}

      {selectedStudent && (
        <StudentProfile
          studentId={selectedStudent.id}
          isOpen={isProfileModalOpen}
          onClose={handleCloseProfileModal}
        />
      )}
    </div>
  );
}
