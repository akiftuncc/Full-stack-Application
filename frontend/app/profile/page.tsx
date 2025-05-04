"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api/user";
import { lessonsApi } from "@/lib/api/lessons-api";
import { ProfileInfo } from "./components/profile-info";
import { RegisteredLessons } from "./components/registered-lessons";
import { AdminSettings } from "./components/admin-settings";
import { Roles } from "@/lib/constants/enums";

export default function ProfilePage() {
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => userApi.getProfile(),
  });

  const {
    data: lessonsData,
    isLoading: lessonsLoading,
    isError: lessonsError,
    refetch,
  } = useQuery({
    queryKey: ["registeredLessons"],
    queryFn: () => lessonsApi.getRegisteredLessons(),
  });

  const lessons = lessonsData?.data || [];

  const handleUnregister = async (lessonId: string) => {
    try {
      await lessonsApi.unregisterLesson(lessonId);
      refetch();
    } catch (err) {
      console.error("Failed to unregister from lesson", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ProfileInfo
        profile={profile || null}
        isLoading={profileLoading}
        isError={profileError}
      />

      {profile?.role === Roles.ADMIN ? (
        <AdminSettings />
      ) : (
        <RegisteredLessons
          lessons={lessons}
          isLoading={lessonsLoading}
          isError={lessonsError}
          onUnregister={handleUnregister}
        />
      )}
    </div>
  );
}
