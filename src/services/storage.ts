/**
 * ADHD Task Manager - Storage Service
 * AsyncStorage utilities for settings and small data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, UserStats, TodayFocusConfig, Category } from '../types';
import { STORAGE_KEYS, DEFAULTS, DEFAULT_CATEGORIES } from '../utils/constants';

/**
 * Get app settings
 */
export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (data) {
      return JSON.parse(data);
    }

    // Return default settings
    return getDefaultSettings();
  } catch (error) {
    console.error('Error getting settings:', error);
    return getDefaultSettings();
  }
};

/**
 * Save app settings
 */
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

/**
 * Get default settings
 */
const getDefaultSettings = (): AppSettings => {
  return {
    pomodoroDuration: DEFAULTS.pomodoroDuration,
    shortBreakDuration: DEFAULTS.shortBreakDuration,
    longBreakDuration: DEFAULTS.longBreakDuration,
    pomodorosUntilLongBreak: DEFAULTS.pomodorosUntilLongBreak,
    enableNotifications: true,
    enableSounds: true,
    dailyMotivationTime: '09:00',
    streakReminderEnabled: true,
    darkMode: true,
    xpMultiplier: 1,
  };
};

/**
 * Get user stats
 */
export const getUserStats = async (): Promise<UserStats> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);

    if (data) {
      const stats = JSON.parse(data);
      // Convert date string back to Date object
      stats.lastActivityDate = new Date(stats.lastActivityDate);
      return stats;
    }

    // Return default stats
    return getDefaultStats();
  } catch (error) {
    console.error('Error getting user stats:', error);
    return getDefaultStats();
  }
};

/**
 * Save user stats
 */
export const saveUserStats = async (stats: UserStats): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving user stats:', error);
    throw error;
  }
};

/**
 * Get default user stats
 */
const getDefaultStats = (): UserStats => {
  return {
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    totalTasksCompleted: 0,
    totalPomodorosCompleted: 0,
    lastActivityDate: new Date(),
  };
};

/**
 * Update user stats after task completion
 */
export const updateStatsAfterTaskCompletion = async (
  xpGained: number,
  pomodorosCompleted: number = 0
): Promise<UserStats> => {
  try {
    const stats = await getUserStats();

    // Update XP
    stats.totalXP += xpGained;

    // Calculate new level
    const { calculateLevel } = require('../utils/xpCalculator');
    stats.level = calculateLevel(stats.totalXP);

    // Update task count
    stats.totalTasksCompleted += 1;

    // Update pomodoros
    stats.totalPomodorosCompleted += pomodorosCompleted;

    // Update streak
    const now = new Date();
    const lastActivity = stats.lastActivityDate;
    const daysDiff = Math.floor(
      (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      // Same day, streak continues
    } else if (daysDiff === 1) {
      // Next day, increment streak
      stats.currentStreak += 1;
      if (stats.currentStreak > stats.longestStreak) {
        stats.longestStreak = stats.currentStreak;
      }
    } else {
      // Streak broken
      stats.currentStreak = 1;
    }

    stats.lastActivityDate = now;

    await saveUserStats(stats);
    return stats;
  } catch (error) {
    console.error('Error updating stats:', error);
    throw error;
  }
};

/**
 * Get today focus config
 */
export const getTodayFocusConfig = async (): Promise<TodayFocusConfig> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TODAY_FOCUS);

    if (data) {
      return JSON.parse(data);
    }

    // Return default config
    return getDefaultTodayFocusConfig();
  } catch (error) {
    console.error('Error getting today focus config:', error);
    return getDefaultTodayFocusConfig();
  }
};

/**
 * Save today focus config
 */
export const saveTodayFocusConfig = async (config: TodayFocusConfig): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TODAY_FOCUS, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving today focus config:', error);
    throw error;
  }
};

/**
 * Get default today focus config
 */
const getDefaultTodayFocusConfig = (): TodayFocusConfig => {
  return {
    maxTasks: DEFAULTS.todayFocusMaxTasks,
    autoSelectByPriority: true,
    autoSelectByDeadline: true,
    autoSelectRecurring: true,
    manualTaskIds: [],
  };
};

/**
 * Get categories from storage
 */
export const getStoredCategories = async (): Promise<Category[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);

    if (data) {
      return JSON.parse(data);
    }

    // Return and save default categories
    await saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  } catch (error) {
    console.error('Error getting categories:', error);
    return DEFAULT_CATEGORIES;
  }
};

/**
 * Save categories
 */
export const saveCategories = async (categories: Category[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
    throw error;
  }
};

/**
 * Clear all storage (for reset/testing)
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.USER_STATS,
      STORAGE_KEYS.TODAY_FOCUS,
      STORAGE_KEYS.CATEGORIES,
      STORAGE_KEYS.LAST_BACKUP,
    ]);
    console.log('All storage cleared');
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

/**
 * Get last backup date
 */
export const getLastBackupDate = async (): Promise<Date | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_BACKUP);
    return data ? new Date(data) : null;
  } catch (error) {
    console.error('Error getting last backup date:', error);
    return null;
  }
};

/**
 * Save last backup date
 */
export const saveLastBackupDate = async (date: Date): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_BACKUP, date.toISOString());
  } catch (error) {
    console.error('Error saving last backup date:', error);
    throw error;
  }
};

export default {
  getSettings,
  saveSettings,
  getUserStats,
  saveUserStats,
  updateStatsAfterTaskCompletion,
  getTodayFocusConfig,
  saveTodayFocusConfig,
  getStoredCategories,
  saveCategories,
  clearAllStorage,
  getLastBackupDate,
  saveLastBackupDate,
};
