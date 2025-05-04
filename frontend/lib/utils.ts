import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse, isValid } from "date-fns";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createForm(data: Record<string, any>): Record<string, any> {
  const filteredData: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (
      key === "birthDate" &&
      value &&
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      isFutureDate(value);
      filteredData[key] = new Date(value).toISOString();
    } else if (value && typeof value === "string" && value.trim() !== "") {
      filteredData[key] = value;
    } else if (value !== null && value !== undefined && value !== "") {
      filteredData[key] = value;
    }
  });

  return filteredData;
}

export function isFutureDate(dateString: string) {
  const today = new Date();

  if (new Date(dateString) > today) {
    toast("Birth date cannot be in the future");
  }
}
