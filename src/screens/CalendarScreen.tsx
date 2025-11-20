/**
 * ADHD Task Manager - Calendar Screen
 * Display tasks in calendar view
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useTask } from '../contexts/TaskContext';
import { TaskCard } from '../components/Task/TaskCard';
import { Task } from '../types';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';
import { isSameDay } from '../utils/dateHelpers';

const CalendarScreen: React.FC = () => {
  const { tasks, completeTask } = useTask();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [tasksForDate, setTasksForDate] = useState<Task[]>([]);

  const loadTasksForDate = React.useCallback((dateString: string) => {
    const selectedDateObj = new Date(dateString);
    const filtered = tasks.filter(task => {
      const taskDate = task.deadline || task.createdAt;
      return isSameDay(taskDate, selectedDateObj);
    });
    setTasksForDate(filtered);
  }, [tasks]);

  useEffect(() => {
    loadTasksForDate(selectedDate);
  }, [selectedDate, loadTasksForDate]);

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    // Mark selected date
    marked[selectedDate] = {
      selected: true,
      selectedColor: COLORS.primary,
    };

    // Mark dates with tasks
    tasks.forEach(task => {
      const taskDate = task.deadline || task.createdAt;
      const dateString = taskDate.toISOString().split('T')[0];

      if (!marked[dateString]) {
        marked[dateString] = { marked: true, dotColor: COLORS.primary };
      } else if (!marked[dateString].selected) {
        marked[dateString].marked = true;
        marked[dateString].dotColor = COLORS.primary;
      }

      // Different color for high priority tasks
      if (task.priority === 'high') {
        marked[dateString].dotColor = COLORS.danger;
      }
    });

    return marked;
  };

  const getTaskStats = () => {
    const total = tasksForDate.length;
    const completed = tasksForDate.filter(t => t.status === 'completed').length;
    const pending = total - completed;

    return { total, completed, pending };
  };

  const stats = getTaskStats();

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <Calendar
        current={selectedDate}
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        markedDates={getMarkedDates()}
        theme={{
          calendarBackground: COLORS.backgroundCard,
          textSectionTitleColor: COLORS.textSecondary,
          selectedDayBackgroundColor: COLORS.primary,
          selectedDayTextColor: COLORS.text,
          todayTextColor: COLORS.primary,
          dayTextColor: COLORS.text,
          textDisabledColor: COLORS.textMuted,
          dotColor: COLORS.primary,
          selectedDotColor: COLORS.text,
          arrowColor: COLORS.primary,
          monthTextColor: COLORS.text,
          indicatorColor: COLORS.primary,
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '600',
          textDayFontSize: FONT_SIZES.medium,
          textMonthFontSize: FONT_SIZES.large,
          textDayHeaderFontSize: FONT_SIZES.small,
        }}
        style={styles.calendar}
      />

      {/* Stats for selected date */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>
            {stats.completed}
          </Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.warning }]}>
            {stats.pending}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Tasks for selected date */}
      <View style={styles.header}>
        <Text style={styles.dateTitle}>
          {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <ScrollView style={styles.taskList} contentContainerStyle={styles.taskListContent}>
        {tasksForDate.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>No tasks for this day</Text>
          </View>
        ) : (
          tasksForDate.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => {
                // TODO: Navigate to task detail
                console.log('Task:', task.id);
              }}
              onComplete={() => handleCompleteTask(task.id)}
              showCategory
              showXP
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundCard,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  statItem: {
    flex: 1,
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
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  dateTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    padding: SPACING.md,
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
    color: COLORS.textSecondary,
  },
});

export default CalendarScreen;
