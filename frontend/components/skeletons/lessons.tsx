import { Roles } from "@/lib/constants/enums";
import { useAuthStore } from "@/lib/store/auth-store";
import { TableCell, TableRow } from "../ui/table";

export default function TableRowSkeleton() {
  return (
    <TableRow className="animate-pulse">
      <TableCell>
        <div className="w-8 h-8 bg-muted rounded-md"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded w-16"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded w-24"></div>
      </TableCell>
      <TableCell>
        <div className="h-6 bg-muted rounded-full w-20"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded w-8"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded w-28"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded w-28"></div>
      </TableCell>

      <TableCell>
        <div className="h-8 bg-muted rounded w-20"></div>
      </TableCell>
    </TableRow>
  );
}
