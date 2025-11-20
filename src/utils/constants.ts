/**
 * ADHD Task Manager - Constants
 * Application-wide constants and configuration
 */

// Color palette
export const COLORS = {
  // Background
  background: '#1a1a1a',
  backgroundLight: '#2a2a2a',
  backgroundCard: '#252525',

  // Primary
  primary: '#6C63FF',
  primaryLight: '#8B84FF',
  primaryDark: '#5548E0',

  // Status colors
  success: '#00D9A3',
  warning: '#FFB800',
  danger: '#FF6B6B',
  info: '#4A9FFF',

  // Text
  text: '#FFFFFF',
  textSecondary: '#E0E0E0',
  textMuted: '#999999',

  // Priority colors
  priorityHigh: '#FF6B6B',
  priorityMedium: '#FFB800',
  priorityLow: '#999999',

  // Gamification
  xpBar: '#00D9A3',
  levelBadge: '#FFD700',
  streak: '#FF6B6B',
};

// Typography
export const FONT_SIZES = {
  tiny: 10,
  small: 12,
  regular: 14,
  medium: 16,
  large: 18,
  title: 20,
  heading: 24,
  timer: 48,
  timerLarge: 64,
};

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const BORDER_RADIUS = {
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  round: 9999,
};

// Default values
export const DEFAULTS = {
  // Pomodoro
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  pomodorosUntilLongBreak: 4,

  // Tasks
  defaultEstimatedTime: 30,
  todayFocusMaxTasks: 5,

  // XP calculation
  baseXP: 10,
  xpPerMinute: 2,
  urgentTaskBonus: 50,
  streakBonusMultiplier: 1.1,

  // Levels
  xpForLevel2: 100,
  xpMultiplierPerLevel: 1.5,
};

// XP Level thresholds
export const XP_LEVELS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 250 },
  { level: 4, xpRequired: 500 },
  { level: 5, xpRequired: 1000 },
  { level: 6, xpRequired: 2000 },
  { level: 7, xpRequired: 3500 },
  { level: 8, xpRequired: 5500 },
  { level: 9, xpRequired: 8500 },
  { level: 10, xpRequired: 12500 },
  { level: 11, xpRequired: 18000 },
  { level: 12, xpRequired: 25000 },
  { level: 13, xpRequired: 35000 },
  { level: 14, xpRequired: 50000 },
  { level: 15, xpRequired: 75000 },
];

// Priority weights for XP calculation
export const PRIORITY_WEIGHTS = {
  low: 1,
  medium: 1.5,
  high: 2,
};

// Default categories
export const DEFAULT_CATEGORIES = [
  { id: 'work', name: 'Work', color: '#4A9FFF', icon: 'briefcase' },
  { id: 'personal', name: 'Personal', color: '#00D9A3', icon: 'person' },
  { id: 'health', name: 'Health', color: '#FF6B6B', icon: 'heart' },
  { id: 'learning', name: 'Learning', color: '#FFB800', icon: 'book' },
  { id: 'chores', name: 'Chores', color: '#9B59B6', icon: 'home' },
  { id: 'social', name: 'Social', color: '#E91E63', icon: 'people' },
];

// Notification channels
export const NOTIFICATION_CHANNELS = {
  TASK_REMINDERS: 'task_reminders',
  POMODORO: 'pomodoro',
  DAILY_MOTIVATION: 'daily_motivation',
  STREAK_WARNING: 'streak_warning',
};

// Storage keys
export const STORAGE_KEYS = {
  SETTINGS: '@adhd_tasker_settings',
  USER_STATS: '@adhd_tasker_stats',
  CATEGORIES: '@adhd_tasker_categories',
  TODAY_FOCUS: '@adhd_tasker_today_focus',
  LAST_BACKUP: '@adhd_tasker_last_backup',
};

// Database info
export const DATABASE = {
  name: 'adhd_tasker.db',
  version: '1.0',
  displayName: 'ADHD Tasker Database',
  size: 5 * 1024 * 1024, // 5MB
};

// Animation durations (in ms)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Task filter presets
export const FILTER_PRESETS = {
  ALL: 'all',
  TODAY: 'today',
  URGENT: 'urgent',
  HIGH_PRIORITY: 'high_priority',
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress',
};

// Date formats
export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  displayWithTime: 'MMM dd, yyyy HH:mm',
  time: 'HH:mm',
  full: 'yyyy-MM-dd HH:mm:ss',
  dateOnly: 'yyyy-MM-dd',
};

// Export/Import
export const EXPORT = {
  version: '1.0.0',
  filePrefix: 'adhd_tasker_backup',
};
