/**
 * ADHD Task Manager - Task List Screen
 * Display all tasks with filters
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTask } from '../contexts/TaskContext';
import { useGamification } from '../contexts/GamificationContext';
import { TaskCard } from '../components/Task/TaskCard';
import { Button } from '../components/Common/Button';
import { COLORS, FONT_SIZES, SPACING, FILTER_PRESETS } from '../utils/constants';
import { Task } from '../types';

const TaskListScreen: React.FC = () => {
  const { tasks, completeTask, refreshTasks, filterTasks } = useTask();
  const { addXP } = useGamification();

  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>(FILTER_PRESETS.ALL);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  const applyFilter = React.useCallback((filterType: string) => {
    let filtered: Task[] = [];

    switch (filterType) {
      case FILTER_PRESETS.ALL:
        filtered = tasks;
        break;
      case FILTER_PRESETS.TODAY:
        filtered = filterTasks({
          status: ['todo', 'in_progress'],
        });
        break;
      case FILTER_PRESETS.URGENT:
        filtered = filterTasks({
          priority: ['high'],
        });
        break;
      case FILTER_PRESETS.IN_PROGRESS:
        filtered = filterTasks({
          status: ['in_progress'],
        });
        break;
      case FILTER_PRESETS.COMPLETED:
        filtered = filterTasks({
          status: ['completed'],
        });
        break;
      default:
        filtered = tasks;
    }

    setFilteredTasks(filtered);
  }, [tasks, filterTasks]);

  React.useEffect(() => {
    applyFilter(activeFilter);
  }, [activeFilter, applyFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTasks();
    setRefreshing(false);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { task, xpGained } = await completeTask(taskId);
      await addXP(xpGained, task.pomodorosCompleted);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const renderFilterButton = (label: string, filterType: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filterType && styles.filterButtonActive,
      ]}
      onPress={() => setActiveFilter(filterType)}
    >
      <Text
        style={[
          styles.filterButtonText,
          activeFilter === filterType && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📝</Text>
      <Text style={styles.emptyText}>No tasks found</Text>
      <Text style={styles.emptySubtext}>
        {activeFilter === FILTER_PRESETS.ALL
          ? 'Create your first task to get started!'
          : 'Try changing the filter'}
      </Text>
      {activeFilter === FILTER_PRESETS.ALL && (
        <Button
          title="Create Task"
          onPress={() => {
            // TODO: Navigate to create task
            console.log('Create task');
          }}
          style={{ marginTop: SPACING.lg }}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <Text style={styles.filterTitle}>Filters</Text>
        <View style={styles.filterButtons}>
          {renderFilterButton('All', FILTER_PRESETS.ALL)}
          {renderFilterButton('Today', FILTER_PRESETS.TODAY)}
          {renderFilterButton('Urgent', FILTER_PRESETS.URGENT)}
          {renderFilterButton('In Progress', FILTER_PRESETS.IN_PROGRESS)}
          {renderFilterButton('Completed', FILTER_PRESETS.COMPLETED)}
        </View>
      </View>

      {/* Task Count */}
      <View style={styles.countBar}>
        <Text style={styles.countText}>
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => {
              // TODO: Navigate to task detail
              console.log('Task pressed:', item.id);
            }}
            onComplete={() => handleCompleteTask(item.id)}
            showCategory
            showXP
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // TODO: Navigate to create task
          console.log('Create task');
        }}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterBar: {
    backgroundColor: COLORS.backgroundCard,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  filterTitle: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  countBar: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  countText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
  },
  listContainer: {
    padding: SPACING.md,
    paddingBottom: 80, // Space for FAB
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
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
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.text,
    fontWeight: '300',
  },
});

export default TaskListScreen;
