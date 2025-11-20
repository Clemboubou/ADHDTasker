/**
 * ADHD Task Manager - Settings Context
 * Global state management for app settings
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, Category } from '../types';
import * as Storage from '../services/storage';
import { DEFAULT_CATEGORIES } from '../utils/constants';

interface SettingsContextType {
  settings: AppSettings;
  categories: Category[];
  loading: boolean;

  // Settings actions
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;

  // Category actions
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;

  // Refresh
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({
    pomodoroDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    pomodorosUntilLongBreak: 4,
    enableNotifications: true,
    enableSounds: true,
    dailyMotivationTime: '09:00',
    streakReminderEnabled: true,
    darkMode: true,
    xpMultiplier: 1,
  });
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);

  // Load settings and categories on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [loadedSettings, loadedCategories] = await Promise.all([
        Storage.getSettings(),
        Storage.getStoredCategories(),
      ]);
      setSettings(loadedSettings);
      setCategories(loadedCategories);
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update app settings
   */
  const updateSettings = async (newSettings: Partial<AppSettings>): Promise<void> => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await Storage.saveSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (err) {
      console.error('Error updating settings:', err);
      throw new Error('Failed to update settings');
    }
  };

  /**
   * Reset settings to defaults
   */
  const resetSettings = async (): Promise<void> => {
    try {
      const defaultSettings: AppSettings = {
        pomodoroDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        pomodorosUntilLongBreak: 4,
        enableNotifications: true,
        enableSounds: true,
        dailyMotivationTime: '09:00',
        streakReminderEnabled: true,
        darkMode: true,
        xpMultiplier: 1,
      };
      await Storage.saveSettings(defaultSettings);
      setSettings(defaultSettings);
    } catch (err) {
      console.error('Error resetting settings:', err);
      throw new Error('Failed to reset settings');
    }
  };

  /**
   * Add a new category
   */
  const addCategory = async (category: Category): Promise<void> => {
    try {
      const updatedCategories = [...categories, category];
      await Storage.saveCategories(updatedCategories);
      setCategories(updatedCategories);
    } catch (err) {
      console.error('Error adding category:', err);
      throw new Error('Failed to add category');
    }
  };

  /**
   * Update an existing category
   */
  const updateCategory = async (category: Category): Promise<void> => {
    try {
      const updatedCategories = categories.map(c =>
        c.id === category.id ? category : c
      );
      await Storage.saveCategories(updatedCategories);
      setCategories(updatedCategories);
    } catch (err) {
      console.error('Error updating category:', err);
      throw new Error('Failed to update category');
    }
  };

  /**
   * Delete a category
   */
  const deleteCategory = async (categoryId: string): Promise<void> => {
    try {
      const updatedCategories = categories.filter(c => c.id !== categoryId);
      await Storage.saveCategories(updatedCategories);
      setCategories(updatedCategories);
    } catch (err) {
      console.error('Error deleting category:', err);
      throw new Error('Failed to delete category');
    }
  };

  /**
   * Refresh settings from storage
   */
  const refreshSettings = async (): Promise<void> => {
    await loadSettings();
  };

  const value: SettingsContextType = {
    settings,
    categories,
    loading,
    updateSettings,
    resetSettings,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
