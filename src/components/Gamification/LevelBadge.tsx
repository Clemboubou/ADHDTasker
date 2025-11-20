/**
 * ADHD Task Manager - Level Badge Component
 * Display current level and title
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';

interface LevelBadgeProps {
  level: number;
  title: string;
  size?: 'small' | 'medium' | 'large';
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  title,
  size = 'medium',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { width: 60, height: 60 },
          levelText: { fontSize: FONT_SIZES.large },
          titleText: { fontSize: FONT_SIZES.tiny },
        };
      case 'large':
        return {
          container: { width: 120, height: 120 },
          levelText: { fontSize: FONT_SIZES.timer },
          titleText: { fontSize: FONT_SIZES.medium },
        };
      default:
        return {
          container: { width: 80, height: 80 },
          levelText: { fontSize: FONT_SIZES.heading },
          titleText: { fontSize: FONT_SIZES.small },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={styles.container}>
      <View style={[styles.badge, sizeStyles.container]}>
        <Text style={[styles.levelText, sizeStyles.levelText]}>{level}</Text>
      </View>
      <Text style={[styles.titleText, sizeStyles.titleText]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.levelBadge,
    shadowColor: COLORS.levelBadge,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  levelText: {
    color: COLORS.text,
    fontWeight: '700',
  },
  titleText: {
    color: COLORS.levelBadge,
    fontWeight: '600',
    marginTop: SPACING.sm,
    textTransform: 'uppercase',
  },
});
