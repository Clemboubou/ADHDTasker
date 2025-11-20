/**
 * ADHD Task Manager - XP Calculator
 * Utilities for calculating experience points and levels
 */

import { Priority } from '../types';
import { DEFAULTS, PRIORITY_WEIGHTS, XP_LEVELS } from './constants';

/**
 * Calculate XP reward for a task based on various factors
 */
export const calculateTaskXP = (
  estimatedTime: number,
  priority: Priority,
  isUrgent: boolean = false,
  currentStreak: number = 0,
): number => {
  // Base XP
  let xp = DEFAULTS.baseXP;

  // Add XP based on time
  xp += estimatedTime * DEFAULTS.xpPerMinute;

  // Apply priority multiplier
  xp *= PRIORITY_WEIGHTS[priority];

  // Urgent task bonus
  if (isUrgent) {
    xp += DEFAULTS.urgentTaskBonus;
  }

  // Streak bonus (1.1x per day of streak)
  if (currentStreak > 0) {
    const streakMultiplier = 1 + (currentStreak * 0.1);
    xp *= streakMultiplier;
  }

  return Math.round(xp);
};

/**
 * Calculate level from total XP
 */
export const calculateLevel = (totalXP: number): number => {
  let level = 1;

  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_LEVELS[i].xpRequired) {
      level = XP_LEVELS[i].level;
      break;
    }
  }

  return level;
};

/**
 * Get XP required for next level
 */
export const getXPForNextLevel = (currentLevel: number): number => {
  const nextLevelData = XP_LEVELS.find(l => l.level === currentLevel + 1);
  return nextLevelData ? nextLevelData.xpRequired : Infinity;
};

/**
 * Get XP required for current level
 */
export const getXPForCurrentLevel = (currentLevel: number): number => {
  const currentLevelData = XP_LEVELS.find(l => l.level === currentLevel);
  return currentLevelData ? currentLevelData.xpRequired : 0;
};

/**
 * Calculate progress to next level (0-1)
 */
export const calculateLevelProgress = (totalXP: number): number => {
  const currentLevel = calculateLevel(totalXP);
  const currentLevelXP = getXPForCurrentLevel(currentLevel);
  const nextLevelXP = getXPForNextLevel(currentLevel);

  if (nextLevelXP === Infinity) {
    return 1; // Max level reached
  }

  const xpIntoLevel = totalXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;

  return xpIntoLevel / xpNeededForLevel;
};

/**
 * Get XP remaining until next level
 */
export const getXPUntilNextLevel = (totalXP: number): number => {
  const currentLevel = calculateLevel(totalXP);
  const nextLevelXP = getXPForNextLevel(currentLevel);

  if (nextLevelXP === Infinity) {
    return 0; // Max level reached
  }

  return nextLevelXP - totalXP;
};

/**
 * Check if task completion will cause a level up
 */
export const willLevelUp = (currentXP: number, xpToAdd: number): boolean => {
  const currentLevel = calculateLevel(currentXP);
  const newLevel = calculateLevel(currentXP + xpToAdd);

  return newLevel > currentLevel;
};

/**
 * Get the new level after adding XP
 */
export const getNewLevel = (currentXP: number, xpToAdd: number): number => {
  return calculateLevel(currentXP + xpToAdd);
};

/**
 * Calculate streak bonus multiplier
 */
export const getStreakMultiplier = (currentStreak: number): number => {
  return 1 + (currentStreak * 0.1);
};

/**
 * Format XP for display
 */
export const formatXP = (xp: number): string => {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
};

/**
 * Get level title/name
 */
export const getLevelTitle = (level: number): string => {
  const titles: Record<number, string> = {
    1: 'Beginner',
    2: 'Novice',
    3: 'Apprentice',
    4: 'Skilled',
    5: 'Expert',
    6: 'Master',
    7: 'Grand Master',
    8: 'Legend',
    9: 'Hero',
    10: 'Champion',
    11: 'Mythic',
    12: 'Legendary',
    13: 'Supreme',
    14: 'Divine',
    15: 'Ascended',
  };

  return titles[level] || `Level ${level}`;
};
