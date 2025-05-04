import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { format } from "date-fns";
import { User as UserIcon } from "lucide-react";

export default function ProfileBox({
  profile,
  setIsEdit,
}: {
  profile: User;
  setIsEdit: (isEdit: boolean) => void;
}) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-primary/10 dark:bg-primary/5 rounded-full mx-auto mb-4 flex items-center justify-center">
        <UserIcon className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-xl font-semibold mb-1 text-foreground">
        {profile.name} {profile.surname}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">@{profile.userName}</p>

      <div className="text-left space-y-3 mt-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name:</span>
          <span className="text-foreground">{profile.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Surname:</span>
          <span className="text-foreground">{profile.surname}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Username:</span>
          <span className="text-foreground">{profile.userName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Birth Date:</span>
          <span className="text-foreground">
            {format(new Date(profile.birthDate), "PPP")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Role:</span>
          <span className="capitalize text-foreground">
            {profile.role.toLowerCase()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Member Since:</span>
          <span className="text-foreground">
            {format(new Date(profile.createdAt), "PPP")}
          </span>
        </div>
      </div>

      <Button
        className="cursor-pointer w-full mt-6"
        variant="outline"
        onClick={() => setIsEdit(true)}
      >
        Edit Profile
      </Button>
    </div>
  );
}
