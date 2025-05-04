import { Card, CardContent, CardHeader } from "../ui/card";
import { CarouselItem } from "../ui/carousel";

export default function LessonSliderSkeleton() {
  return (
    <>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <CarouselItem key={index} className="basis-1/3 pl-4">
            <Card className="bg-card backdrop-blur-sm animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
    </>
  );
}
