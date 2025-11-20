/**
 * ADHD Task Manager - Gamification Context
 * Global state management for XP, levels, and streaks
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserStats } from '../types';
import * as Storage from '../services/storage';
import {
  calculateLevel,
  calculateLevelProgress,
  getXPForNextLevel,
  getXPUntilNextLevel,
  willLevelUp,
  getLevelTitle,
} from '../utils/xpCalculator';

interface GamificationContextType {
  stats: UserStats;
  loading: boolean;

  // Level info
  currentLevel: number;
  levelProgress: number; // 0-1
  xpForNextLevel: number;
  xpUntilNextLevel: number;
  levelTitle: string;

  // Actions
  addXP: (xp: number, pomodorosCompleted?: number) => Promise<boolean>; // Returns true if leveled up
  resetStreak: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>({
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    totalTasksCompleted: 0,
    totalPomodorosCompleted: 0,
    lastActivityDate: new Date(),
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Derived state
  const currentLevel = calculateLevel(stats.totalXP);
  const levelProgress = calculateLevelProgress(stats.totalXP);
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  const xpUntilNextLevel = getXPUntilNextLevel(stats.totalXP);
  const levelTitle = getLevelTitle(currentLevel);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const loadedStats = await Storage.getUserStats();
      setStats(loadedStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add XP and update stats
   * Returns true if the user leveled up
   */
  const addXP = async (xp: number, pomodorosCompleted: number = 0): Promise<boolean> => {
    try {
      const leveledUp = willLevelUp(stats.totalXP, xp);
      const updatedStats = await Storage.updateStatsAfterTaskCompletion(xp, pomodorosCompleted);
      setStats(updatedStats);
      return leveledUp;
    } catch (err) {
      console.error('Error adding XP:', err);
      return false;
    }
  };

  /**
   * Reset streak to 0
   */
  const resetStreak = async (): Promise<void> => {
    try {
      const updatedStats: UserStats = {
        ...stats,
        currentStreak: 0,
      };
      await Storage.saveUserStats(updatedStats);
      setStats(updatedStats);
    } catch (err) {
      console.error('Error resetting streak:', err);
    }
  };

  /**
   * Refresh stats from storage
   */
  const refreshStats = async (): Promise<void> => {
    await loadStats();
  };

  const value: GamificationContextType = {
    stats,
    loading,
    currentLevel,
    levelProgress,
    xpForNextLevel,
    xpUntilNextLevel,
    levelTitle,
    addXP,
    resetStreak,
    refreshStats,
  };

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};
