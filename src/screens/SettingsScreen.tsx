/**
 * ADHD Task Manager - Settings Screen
 * App settings and preferences
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { useSettings } from '../contexts/SettingsContext';
import { useGamification } from '../contexts/GamificationContext';
import { useTask } from '../contexts/TaskContext';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../utils/constants';
import { Button } from '../components/Common/Button';
import * as ExportService from '../services/export';

const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, categories } = useSettings();
  const { stats } = useGamification();
  const { refreshTasks } = useTask();

  const toggleSetting = async (key: keyof typeof settings) => {
    await updateSettings({ [key]: !settings[key] });
  };

  const handleExport = async () => {
    try {
      const filePath = await ExportService.exportAllData();
      Alert.alert(
        'Export Successful',
        `Data exported successfully to:\n${filePath}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export data. Please try again.');
      console.error('Export error:', error);
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      // Validate file
      const isValid = await ExportService.validateImportFile(result.uri);
      if (!isValid) {
        Alert.alert('Invalid File', 'The selected file is not a valid backup file.');
        return;
      }

      Alert.alert(
        'Import Data',
        'This will replace all current data. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            style: 'destructive',
            onPress: async () => {
              try {
                await ExportService.importData(result.uri);
                await refreshTasks();
                Alert.alert('Success', 'Data imported successfully!');
              } catch (error) {
                Alert.alert('Import Failed', 'Failed to import data.');
                console.error('Import error:', error);
              }
            },
          },
        ]
      );
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        Alert.alert('Error', 'Failed to select file.');
        console.error('File picker error:', error);
      }
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your tasks, templates, and settings. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all data from database and storage
              await ExportService.exportAllData(); // Create backup first
              Alert.alert(
                'Backup Created',
                'A backup has been created before clearing. Please proceed to clear all data manually or implement database clear functionality.'
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data.');
              console.error('Clear error:', error);
            }
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    label: string,
    value: boolean,
    onToggle: () => void,
    description?: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.backgroundLight, true: COLORS.primary }}
        thumbColor={COLORS.text}
      />
    </View>
  );

  const renderInfoItem = (label: string, value: string | number) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.statsCard}>
          {renderInfoItem('Level', stats.level.toString())}
          {renderInfoItem('Total XP', stats.totalXP.toString())}
          {renderInfoItem('Current Streak', `${stats.currentStreak} days`)}
          {renderInfoItem('Tasks Completed', stats.totalTasksCompleted.toString())}
          {renderInfoItem('Pomodoros', stats.totalPomodorosCompleted.toString())}
        </View>
      </View>

      {/* Pomodoro Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pomodoro Timer</Text>
        <View style={styles.card}>
          {renderInfoItem('Focus Duration', `${settings.pomodoroDuration} min`)}
          {renderInfoItem('Short Break', `${settings.shortBreakDuration} min`)}
          {renderInfoItem('Long Break', `${settings.longBreakDuration} min`)}
          {renderInfoItem('Pomodoros Until Long Break', settings.pomodorosUntilLongBreak.toString())}
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          {renderSettingItem(
            'Enable Notifications',
            settings.enableNotifications,
            () => toggleSetting('enableNotifications'),
            'Receive reminders and alerts'
          )}
          {renderSettingItem(
            'Sound Effects',
            settings.enableSounds,
            () => toggleSetting('enableSounds'),
            'Play sounds for timer and notifications'
          )}
          {renderSettingItem(
            'Streak Reminders',
            settings.streakReminderEnabled,
            () => toggleSetting('streakReminderEnabled'),
            'Get reminded if streak is in danger'
          )}
        </View>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          {renderSettingItem(
            'Dark Mode',
            settings.darkMode,
            () => toggleSetting('darkMode'),
            'Use dark theme'
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.card}>
          {categories.map(cat => (
            <View key={cat.id} style={styles.categoryItem}>
              <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
              <Text style={styles.categoryName}>{cat.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <Button
          title="Export Data"
          onPress={handleExport}
          variant="secondary"
          style={{ marginBottom: SPACING.sm }}
        />
        <Button
          title="Import Data"
          onPress={handleImport}
          variant="secondary"
          style={{ marginBottom: SPACING.sm }}
        />
        <Button
          title="Clear All Data"
          onPress={handleClearData}
          variant="danger"
        />
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.appInfo}>ADHD Task Manager v1.0.0</Text>
        <Text style={styles.appInfo}>Made with ❤️ for productivity</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.md,
  },
  statsCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  settingText: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  infoLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: '600',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  categoryName: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  appInfo: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
});

export default SettingsScreen;
