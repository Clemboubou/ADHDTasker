/**
 * ADHD Task Manager - Task Card Component
 * Display task in a card format
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../../types';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { formatDuration, getRelativeDateString } from '../../utils/dateHelpers';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onComplete?: () => void;
  showCategory?: boolean;
  showXP?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onComplete,
  showCategory = true,
  showXP = true,
}) => {
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return COLORS.priorityHigh;
      case 'medium':
        return COLORS.priorityMedium;
      default:
        return COLORS.priorityLow;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return COLORS.success;
      case 'in_progress':
        return COLORS.warning;
      default:
        return COLORS.textMuted;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: getPriorityColor() }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {task.title}
        </Text>
        {onComplete && task.status !== 'completed' && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={onComplete}
          >
            <Text style={styles.completeIcon}>✓</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Description */}
      {task.description && (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.leftFooter}>
          {showCategory && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{task.category}</Text>
            </View>
          )}

          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{formatDuration(task.estimatedTime)}</Text>
          </View>

          {task.deadline && (
            <View style={styles.deadlineBadge}>
              <Text style={styles.deadlineText}>
                {getRelativeDateString(task.deadline)}
              </Text>
            </View>
          )}
        </View>

        {showXP && (
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{task.xpReward} XP</Text>
          </View>
        )}
      </View>

      {/* Status indicator */}
      <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  completeButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeIcon: {
    fontSize: FONT_SIZES.large,
    color: COLORS.text,
    fontWeight: '700',
  },
  description: {
    fontSize: FONT_SIZES.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  categoryText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    fontWeight: '500',
  },
  timeBadge: {
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  timeText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
  deadlineBadge: {
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  deadlineText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.warning,
  },
  xpBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  xpText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    fontWeight: '600',
  },
  statusDot: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.round,
  },
});
