"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api/public-api";
import { Lesson } from "@/types/public";
import { LessonLevel, LessonStatus } from "@/lib/constants/enums";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import LessonSliderSkeleton from "./skeletons/lesson-slider";

export function LessonSlider() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const response = await publicApi.getLessons();
      return response.data || [];
    },
  });

  const getLevelColor = (level: LessonLevel) => {
    switch (level) {
      case LessonLevel.BEGINNER:
        return "text-green-600 dark:text-green-400";
      case LessonLevel.INTERMEDIATE:
        return "text-blue-600 dark:text-blue-400";
      case LessonLevel.ADVANCED:
        return "text-purple-600 dark:text-purple-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: LessonStatus) => {
    return status === LessonStatus.ACTIVE
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  return (
    <div className="container mx-auto">
      <Carousel
        plugins={[autoplayPlugin.current]}
        className="w-full"
        onMouseEnter={() => autoplayPlugin.current.stop()}
        onMouseLeave={() => autoplayPlugin.current.play()}
      >
        <CarouselContent>
          {isLoading ? (
            <LessonSliderSkeleton />
          ) : (
            <>
              {lessons?.map((lesson) => (
                <CarouselItem key={lesson.id} className="md:basis-1/3 pl-4">
                  <Card className="bg-card text-card-foreground backdrop-blur-sm">
                    <div className="flex">
                      <div className="w-1/4 flex items-center justify-center p-2">
                        <img
                          src="/each-book.png"
                          alt="Book"
                          className="h-auto max-w-full"
                        />
                      </div>
                      <div className="w-3/4">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold">
                            {lesson.name}
                          </CardTitle>
                          <CardDescription className="flex justify-between items-center">
                            <span className={getLevelColor(lesson.level)}>
                              {lesson.level.toLowerCase()}
                            </span>
                            <span className={getStatusColor(lesson.status)}>
                              {lesson.status.toLowerCase()}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            Duration: {lesson.duration} hours
                          </p>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </>
          )}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
