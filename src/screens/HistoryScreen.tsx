/**
 * ADHD Task Manager - History Screen
 * Display completed tasks and statistics (placeholder)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTask } from '../contexts/TaskContext';
import { useGamification } from '../contexts/GamificationContext';
import { TaskCard } from '../components/Task/TaskCard';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';

const HistoryScreen: React.FC = () => {
  const { tasks } = useTask();
  const { stats } = useGamification();

  const completedTasks = tasks.filter(t => t.status === 'completed').slice(0, 10);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Stats Summary */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalTasksCompleted}</Text>
          <Text style={styles.statLabel}>Tasks Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalXP}</Text>
          <Text style={styles.statLabel}>Total XP Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalPomodorosCompleted}</Text>
          <Text style={styles.statLabel}>Pomodoros Done</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.longestStreak}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>

      {/* Recent Completed Tasks */}
      <Text style={styles.sectionTitle}>Recently Completed</Text>
      {completedTasks.length > 0 ? (
        completedTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onPress={() => console.log('Task:', task.id)}
            showCategory
            showXP
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🏆</Text>
          <Text style={styles.emptyText}>No completed tasks yet</Text>
          <Text style={styles.emptySubtext}>Complete tasks to see them here</Text>
        </View>
      )}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.heading,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.regular,
    color: COLORS.textMuted,
  },
});

export default HistoryScreen;
