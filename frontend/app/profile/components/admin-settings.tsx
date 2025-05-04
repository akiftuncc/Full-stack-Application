import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Routes } from "@/lib/constants/enums";

const mockAdminData = [
  {
    id: "1",
    setting: "Dashboard",
    status: "Enabled",
    lastModified: "2013-10-15",
  },
  {
    id: "2",
    setting: "Students",
    status: "Enabled",
    lastModified: "2023-10-18",
  },
  {
    id: "3",
    setting: "Lessons",
    status: "Enabled",
    lastModified: "2019-11-05",
  },
  {
    id: "4",
    setting: "Analytics Dashboard",
    status: "Disabled",
    lastModified: "2023-09-30",
  },
  {
    id: "5",
    setting: "Email Notifications",
    status: "Disabled",
    lastModified: "2022-10-22",
  },
  {
    id: "6",
    setting: "Security",
    status: "Disabled",
    lastModified: "2024-10-22",
  },
  {
    id: "7",
    setting: "System Settings",
    status: "Disabled",
    lastModified: "2015-10-15",
  },
];

export function AdminSettings() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Admin Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Setting</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAdminData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.setting}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === "Enabled"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>{item.lastModified}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${
                      item.status === "Disabled" ? "" : "cursor-pointer"
                    }`}
                    disabled={item.status === "Disabled"}
                  >
                    {item.status === "Disabled" ? (
                      <span className="text-gray-500">Configure</span>
                    ) : (
                      <Link href={Routes.ADMIN}>Configure</Link>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
