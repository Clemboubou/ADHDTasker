/**
 * ADHD Task Manager - Settings Screen
 * App settings and preferences
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { useGamification } from '../contexts/GamificationContext';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../utils/constants';
import { Button } from '../components/Common/Button';

const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, categories } = useSettings();
  const { stats } = useGamification();

  const toggleSetting = async (key: keyof typeof settings) => {
    await updateSettings({ [key]: !settings[key] });
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
          onPress={() => {
            // TODO: Implement export
            console.log('Export data');
          }}
          variant="secondary"
          style={{ marginBottom: SPACING.sm }}
        />
        <Button
          title="Import Data"
          onPress={() => {
            // TODO: Implement import
            console.log('Import data');
          }}
          variant="secondary"
          style={{ marginBottom: SPACING.sm }}
        />
        <Button
          title="Clear All Data"
          onPress={() => {
            // TODO: Implement clear with confirmation
            console.log('Clear data');
          }}
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
