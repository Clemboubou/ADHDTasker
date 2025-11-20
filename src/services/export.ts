/**
 * ADHD Task Manager - Export/Import Service
 * Handle data export and import as JSON
 */

import { Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import { ExportData } from '../types';
import * as Database from './database';
import * as Storage from './storage';
import { EXPORT } from '../utils/constants';

/**
 * Request storage permissions (Android)
 */
const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to your storage to export data',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

/**
 * Export all app data to JSON
 */
export const exportAllData = async (): Promise<string> => {
  try {
    // Gather all data
    const [tasks, templates, settings, stats, categories] = await Promise.all([
      Database.getAllTasks(),
      Database.getAllTemplates(),
      Storage.getSettings(),
      Storage.getUserStats(),
      Storage.getStoredCategories(),
    ]);

    // Create export object
    const exportData: ExportData = {
      version: EXPORT.version,
      exportDate: new Date(),
      tasks,
      templates,
      settings,
      stats,
      categories,
    };

    // Convert to JSON
    const jsonData = JSON.stringify(exportData, null, 2);

    // Request permission
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission denied');
    }

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `${EXPORT.filePrefix}_${timestamp}.json`;

    // Define path
    const downloadPath = Platform.OS === 'android'
      ? `${RNFS.DownloadDirectoryPath}/${filename}`
      : `${RNFS.DocumentDirectoryPath}/${filename}`;

    // Write file
    await RNFS.writeFile(downloadPath, jsonData, 'utf8');

    // Update last backup date
    await Storage.saveLastBackupDate(new Date());

    console.log('Data exported to:', downloadPath);
    return downloadPath;
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};

/**
 * Import data from JSON file
 */
export const importData = async (filePath: string): Promise<void> => {
  try {
    // Read file
    const jsonData = await RNFS.readFile(filePath, 'utf8');
    const data: ExportData = JSON.parse(jsonData);

    // Validate version
    if (!data.version) {
      throw new Error('Invalid backup file: missing version');
    }

    // Import tasks
    if (data.tasks && Array.isArray(data.tasks)) {
      for (const task of data.tasks) {
        // Convert date strings back to Date objects
        task.createdAt = new Date(task.createdAt);
        if (task.completedAt) task.completedAt = new Date(task.completedAt);
        if (task.deadline) task.deadline = new Date(task.deadline);

        await Database.insertTask(task);
      }
    }

    // Import templates
    if (data.templates && Array.isArray(data.templates)) {
      for (const template of data.templates) {
        template.createdAt = new Date(template.createdAt);
        await Database.insertTemplate(template);
      }
    }

    // Import settings
    if (data.settings) {
      await Storage.saveSettings(data.settings);
    }

    // Import stats
    if (data.stats) {
      data.stats.lastActivityDate = new Date(data.stats.lastActivityDate);
      await Storage.saveUserStats(data.stats);
    }

    // Import categories
    if (data.categories && Array.isArray(data.categories)) {
      await Storage.saveCategories(data.categories);
    }

    console.log('Data imported successfully');
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
};

/**
 * Export tasks only (CSV format)
 */
export const exportTasksCSV = async (): Promise<string> => {
  try {
    const tasks = await Database.getAllTasks();

    // CSV header
    let csv = 'Title,Description,Status,Priority,Category,Estimated Time (min),XP Reward,Created At,Completed At\n';

    // Add rows
    tasks.forEach(task => {
      const row = [
        `"${task.title.replace(/"/g, '""')}"`,
        `"${(task.description || '').replace(/"/g, '""')}"`,
        task.status,
        task.priority,
        task.category,
        task.estimatedTime,
        task.xpReward,
        task.createdAt.toISOString(),
        task.completedAt ? task.completedAt.toISOString() : '',
      ].join(',');
      csv += row + '\n';
    });

    // Request permission
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      throw new Error('Storage permission denied');
    }

    // Create filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `adhd_tasker_tasks_${timestamp}.csv`;

    // Define path
    const downloadPath = Platform.OS === 'android'
      ? `${RNFS.DownloadDirectoryPath}/${filename}`
      : `${RNFS.DocumentDirectoryPath}/${filename}`;

    // Write file
    await RNFS.writeFile(downloadPath, csv, 'utf8');

    console.log('Tasks exported to CSV:', downloadPath);
    return downloadPath;
  } catch (error) {
    console.error('CSV export error:', error);
    throw error;
  }
};

/**
 * Get backup file info
 */
export const getBackupInfo = async (): Promise<{
  lastBackup: Date | null;
  tasksCount: number;
  templatesCount: number;
}> => {
  try {
    const [lastBackup, tasks, templates] = await Promise.all([
      Storage.getLastBackupDate(),
      Database.getAllTasks(),
      Database.getAllTemplates(),
    ]);

    return {
      lastBackup,
      tasksCount: tasks.length,
      templatesCount: templates.length,
    };
  } catch (error) {
    console.error('Error getting backup info:', error);
    return {
      lastBackup: null,
      tasksCount: 0,
      templatesCount: 0,
    };
  }
};

/**
 * Validate import file
 */
export const validateImportFile = async (filePath: string): Promise<boolean> => {
  try {
    const jsonData = await RNFS.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    // Check required fields
    if (!data.version || !data.exportDate) {
      return false;
    }

    return true;
  } catch (_error) {
    return false;
  }
};

export default {
  exportAllData,
  importData,
  exportTasksCSV,
  getBackupInfo,
  validateImportFile,
};
