"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/user";
import ProfileSkeleton from "@/components/skeletons/profile";
import ProfileBox from "./profile-box";
import EditProfileBox from "./edit-profile-box";
import { useState } from "react";

interface ProfileInfoProps {
  profile: User | null;
  isLoading: boolean;
  isError: boolean;
}

export function ProfileInfo({ profile, isLoading, isError }: ProfileInfoProps) {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <Card className="md:col-span-1 bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-center text-foreground">
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ProfileSkeleton />
        ) : isError ? (
          <div className="text-destructive">Failed to load profile</div>
        ) : profile ? (
          isEdit ? (
            <EditProfileBox profile={profile} setIsEdit={setIsEdit} />
          ) : (
            <ProfileBox profile={profile} setIsEdit={setIsEdit} />
          )
        ) : null}
      </CardContent>
    </Card>
  );
}
