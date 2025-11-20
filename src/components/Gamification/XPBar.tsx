/**
 * ADHD Task Manager - XP Bar Component
 * Visual progress bar for XP and level progress
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { formatXP } from '../../utils/xpCalculator';

interface XPBarProps {
  currentXP: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  progress: number; // 0-1
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXP: _currentXP,
  xpForNextLevel,
  xpInCurrentLevel,
  progress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Text style={styles.xpText}>{formatXP(xpInCurrentLevel)} XP</Text>
        <Text style={styles.xpText}>{formatXP(xpForNextLevel)} XP</Text>
      </View>
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  xpText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  barContainer: {
    height: 8,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.xpBar,
    borderRadius: BORDER_RADIUS.round,
  },
});
