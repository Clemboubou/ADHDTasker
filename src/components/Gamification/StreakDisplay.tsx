/**
 * ADHD Task Manager - Streak Display Component
 * Display current streak and longest streak
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  compact?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  longestStreak,
  compact = false,
}) => {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactEmoji}>🔥</Text>
        <Text style={styles.compactText}>{currentStreak} day{currentStreak !== 1 ? 's' : ''}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.streakCard}>
        <Text style={styles.emoji}>🔥</Text>
        <Text style={styles.label}>Current Streak</Text>
        <Text style={styles.value}>{currentStreak}</Text>
        <Text style={styles.unit}>day{currentStreak !== 1 ? 's' : ''}</Text>
      </View>

      <View style={styles.streakCard}>
        <Text style={styles.emoji}>🏆</Text>
        <Text style={styles.label}>Longest Streak</Text>
        <Text style={styles.value}>{longestStreak}</Text>
        <Text style={styles.unit}>day{longestStreak !== 1 ? 's' : ''}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  streakCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.streak,
  },
  emoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: FONT_SIZES.heading,
    color: COLORS.streak,
    fontWeight: '700',
  },
  unit: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.streak,
  },
  compactEmoji: {
    fontSize: FONT_SIZES.large,
    marginRight: SPACING.xs,
  },
  compactText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.streak,
    fontWeight: '600',
  },
});
