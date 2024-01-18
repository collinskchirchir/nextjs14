import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  // Convert milliseconds to seconds
  const seconds = Math.floor(timeDifference / 1000);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  // Convert seconds to minutes
  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  // Convert minutes to hours
  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hours ago`;
  }

  // Convert hours to days
  const days = Math.floor(hours / 24);

  return `${days} days ago`;
};
