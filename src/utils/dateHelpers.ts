/**
 * ADHD Task Manager - Date Helpers
 * Utilities for date manipulation and formatting
 */

import { format, parseISO, isToday, isTomorrow, isPast, differenceInDays, startOfDay, endOfDay, addDays } from 'date-fns';
import { DATE_FORMATS } from './constants';

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, DATE_FORMATS.display);
};

/**
 * Format date with time
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, DATE_FORMATS.displayWithTime);
};

/**
 * Format time only
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, DATE_FORMATS.time);
};

/**
 * Get relative date string (Today, Tomorrow, or formatted date)
 */
export const getRelativeDateString = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return 'Today';
  }

  if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  }

  return formatDate(dateObj);
};

/**
 * Check if a date is today
 */
export const isDateToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
};

/**
 * Check if a date is in the past
 */
export const isDatePast = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isPast(dateObj);
};

/**
 * Check if a deadline is urgent (within 24 hours)
 */
export const isDeadlineUrgent = (deadline: Date | string): boolean => {
  const deadlineObj = typeof deadline === 'string' ? parseISO(deadline) : deadline;
  const now = new Date();
  const diffInHours = (deadlineObj.getTime() - now.getTime()) / (1000 * 60 * 60);

  return diffInHours > 0 && diffInHours <= 24;
};

/**
 * Get days until deadline
 */
export const getDaysUntilDeadline = (deadline: Date | string): number => {
  const deadlineObj = typeof deadline === 'string' ? parseISO(deadline) : deadline;
  return differenceInDays(deadlineObj, new Date());
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Get start of day
 */
export const getStartOfDay = (date?: Date): Date => {
  return startOfDay(date || new Date());
};

/**
 * Get end of day
 */
export const getEndOfDay = (date?: Date): Date => {
  return endOfDay(date || new Date());
};

/**
 * Get date N days from now
 */
export const getDaysFromNow = (days: number): Date => {
  return addDays(new Date(), days);
};

/**
 * Check if streak is in danger (no activity today and it's past 8 PM)
 */
export const isStreakInDanger = (lastActivityDate: Date | string): boolean => {
  const lastActivity = typeof lastActivityDate === 'string' ? parseISO(lastActivityDate) : lastActivityDate;
  const now = new Date();

  // If last activity was not today
  if (!isSameDay(lastActivity, now)) {
    // And it's past 8 PM
    if (now.getHours() >= 20) {
      return true;
    }
  }

  return false;
};

/**
 * Calculate current streak
 */
export const calculateStreak = (lastActivityDate: Date | string): number => {
  const lastActivity = typeof lastActivityDate === 'string' ? parseISO(lastActivityDate) : lastActivityDate;
  const now = new Date();
  const daysDiff = differenceInDays(now, lastActivity);

  // If activity was today or yesterday, streak continues
  if (daysDiff <= 1) {
    return 1; // This needs to be tracked properly in the database
  }

  // Streak is broken
  return 0;
};

/**
 * Format duration in minutes to human readable string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Parse time string (HH:MM) to Date object
 */
export const parseTimeString = (timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * Convert Date to time string (HH:MM)
 */
export const toTimeString = (date: Date): string => {
  return format(date, 'HH:mm');
};

/**
 * Get week start and end dates
 */
export const getWeekRange = (date: Date = new Date()): { start: Date; end: Date } => {
  const dayOfWeek = date.getDay();
  const start = new Date(date);
  start.setDate(date.getDate() - dayOfWeek);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/**
 * Get month start and end dates
 */
export const getMonthRange = (date: Date = new Date()): { start: Date; end: Date } => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  return { start, end };
};
