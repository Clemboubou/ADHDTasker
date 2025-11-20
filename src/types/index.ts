/**
 * ADHD Task Manager - Type Definitions
 * Contains all TypeScript interfaces and types for the application
 */

// Priority levels for tasks
export type Priority = 'low' | 'medium' | 'high';

// Task status
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

// Recurring pattern types
export type RecurringPattern = 'none' | 'daily' | 'weekly' | 'monthly';

// Notification repeat options
export type NotificationRepeat = 'none' | 'daily' | 'weekly';

/**
 * Main Task interface
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedTime: number; // in minutes
  category: string;
  priority: Priority;
  status: TaskStatus;
  photos: string[]; // array of URIs
  createdAt: Date;
  completedAt?: Date;
  deadline?: Date;
  xpReward: number;
  pomodorosCompleted: number;
  chainId?: string; // if part of a chain
  chainOrder?: number; // order in the chain
  nextTaskId?: string; // next task in the chain
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
}

/**
 * Template for task routines
 */
export interface Template {
  id: string;
  name: string;
  description?: string;
  tasks: Omit<Task, 'id' | 'createdAt' | 'completedAt'>[]; // tasks without ID
  isChained: boolean; // if tasks are automatically chained
  createdAt: Date;
}

/**
 * User statistics and gamification data
 */
export interface UserStats {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  totalPomodorosCompleted: number;
  lastActivityDate: Date;
}

/**
 * Notification configuration
 */
export interface NotificationConfig {
  id: string;
  taskId: string;
  time: Date;
  repeat: NotificationRepeat;
  isPersistent: boolean;
  isEnabled: boolean;
}

/**
 * Pomodoro session data
 */
export interface PomodoroSession {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  isCompleted: boolean;
  isBreak: boolean;
}

/**
 * Task chain data
 */
export interface TaskChain {
  id: string;
  name: string;
  taskIds: string[];
  createdAt: Date;
  currentTaskIndex: number;
}

/**
 * Category data
 */
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

/**
 * App settings
 */
export interface AppSettings {
  // Pomodoro settings
  pomodoroDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  pomodorosUntilLongBreak: number;

  // Notification settings
  enableNotifications: boolean;
  enableSounds: boolean;
  dailyMotivationTime?: string; // HH:MM format
  streakReminderEnabled: boolean;

  // UI settings
  darkMode: boolean;

  // Gamification settings
  xpMultiplier: number;
}

/**
 * Filter options for task list
 */
export interface TaskFilters {
  status?: TaskStatus[];
  priority?: Priority[];
  category?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}

/**
 * Statistics data for history view
 */
export interface Statistics {
  totalTasks: number;
  completedTasks: number;
  totalTime: number; // in minutes
  totalXP: number;
  completionRate: number; // percentage
  mostProductiveCategory: string;
  averageTaskTime: number; // in minutes
  tasksByDate: {
    date: string;
    count: number;
  }[];
  tasksByCategory: {
    category: string;
    count: number;
  }[];
}

/**
 * Export data structure
 */
export interface ExportData {
  version: string;
  exportDate: Date;
  tasks: Task[];
  templates: Template[];
  settings: AppSettings;
  stats: UserStats;
  categories: Category[];
}

/**
 * Today Focus configuration
 */
export interface TodayFocusConfig {
  maxTasks: number;
  autoSelectByPriority: boolean;
  autoSelectByDeadline: boolean;
  autoSelectRecurring: boolean;
  manualTaskIds: string[];
}
