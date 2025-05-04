import { TableCell, TableRow } from "@/components/ui/table";

export default function StudentSkeleton() {
  return (
    <TableRow className="animate-pulse">
      <TableCell>
        <div className="h-4 bg-muted rounded w-12"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded w-32"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded w-32"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded w-24"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded w-32"></div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <div className="h-8 bg-muted rounded w-16"></div>
          <div className="h-8 bg-muted rounded w-16"></div>
        </div>
      </TableCell>
    </TableRow>
  );
}
