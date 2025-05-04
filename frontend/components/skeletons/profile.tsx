export default function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-20 w-20 bg-muted rounded-full mb-4 mx-auto"></div>
      <div className="h-6 bg-muted rounded w-1/2 mb-2 mx-auto"></div>
      <div className="h-4 bg-muted rounded w-1/3 mb-6 mx-auto"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    </div>
  );
}
