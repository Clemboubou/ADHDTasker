/**
 * ADHD Task Manager - Home Screen (Today Focus)
 * Display 3-5 priority tasks for the day
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useTask } from '../contexts/TaskContext';
import { useGamification } from '../contexts/GamificationContext';
import { TaskCard } from '../components/Task/TaskCard';
import { LevelBadge } from '../components/Gamification/LevelBadge';
import { StreakDisplay } from '../components/Gamification/StreakDisplay';
import { XPBar } from '../components/Gamification/XPBar';
import { Button } from '../components/Common/Button';
import { COLORS, FONT_SIZES, SPACING, DEFAULTS } from '../utils/constants';
import { Task } from '../types';
import { getXPForCurrentLevel } from '../utils/xpCalculator';

const HomeScreen: React.FC = () => {
  const { tasks, completeTask, getTodayTasks, getUrgentTasks, refreshTasks, loading } = useTask();
  const { stats, currentLevel, levelProgress, xpForNextLevel, xpUntilNextLevel, levelTitle, addXP } = useGamification();

  const [refreshing, setRefreshing] = useState(false);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTodayTasks();
  }, [tasks]);

  const loadTodayTasks = () => {
    // Get urgent tasks and today's tasks
    const urgent = getUrgentTasks();
    const today = getTodayTasks();

    // Combine and deduplicate
    const combined = [...urgent];
    today.forEach(task => {
      if (!combined.find(t => t.id === task.id)) {
        combined.push(task);
      }
    });

    // Sort by priority and deadline
    const sorted = combined.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];

      if (priorityDiff !== 0) return priorityDiff;

      if (a.deadline && b.deadline) {
        return a.deadline.getTime() - b.deadline.getTime();
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;

      return 0;
    });

    // Take only top 5
    setTodayTasks(sorted.slice(0, DEFAULTS.todayFocusMaxTasks));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTasks();
    setRefreshing(false);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { task, xpGained } = await completeTask(taskId);
      const leveledUp = await addXP(xpGained, task.pomodorosCompleted);

      if (leveledUp) {
        // Show level up animation (TODO: implement)
        console.log('Level up!');
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const currentLevelXP = getXPForCurrentLevel(currentLevel);
  const xpInCurrentLevel = stats.totalXP - currentLevelXP;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Today's Focus</Text>
          <Text style={styles.subtitle}>
            {todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''} to conquer
          </Text>
        </View>
      </View>

      {/* Gamification Stats */}
      <View style={styles.statsSection}>
        <View style={styles.levelSection}>
          <LevelBadge level={currentLevel} title={levelTitle} size="medium" />
          <View style={styles.xpSection}>
            <XPBar
              currentXP={stats.totalXP}
              xpForNextLevel={xpForNextLevel}
              xpInCurrentLevel={xpInCurrentLevel}
              progress={levelProgress}
            />
            <Text style={styles.xpRemainingText}>
              {xpUntilNextLevel} XP to level {currentLevel + 1}
            </Text>
          </View>
        </View>

        <StreakDisplay
          currentStreak={stats.currentStreak}
          longestStreak={stats.longestStreak}
        />
      </View>

      {/* Today's Tasks */}
      <View style={styles.tasksSection}>
        <Text style={styles.sectionTitle}>Your Priority Tasks</Text>

        {todayTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyText}>No tasks for today!</Text>
            <Text style={styles.emptySubtext}>You're all caught up or ready to add new tasks</Text>
          </View>
        ) : (
          todayTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => {
                // TODO: Navigate to task detail
                console.log('Task pressed:', task.id);
              }}
              onComplete={() => handleCompleteTask(task.id)}
              showCategory
              showXP
            />
          ))
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalTasksCompleted}</Text>
          <Text style={styles.statLabel}>Tasks Done</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalPomodorosCompleted}</Text>
          <Text style={styles.statLabel}>Pomodoros</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalXP}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  greetingSection: {
    marginBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZES.heading,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  statsSection: {
    marginBottom: SPACING.xl,
  },
  levelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.lg,
  },
  xpSection: {
    flex: 1,
  },
  xpRemainingText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  tasksSection: {
    marginBottom: SPACING.lg,
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
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
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
  },
});

export default HomeScreen;
