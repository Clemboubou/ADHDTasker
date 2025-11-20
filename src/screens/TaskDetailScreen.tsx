/**
 * ADHD Task Manager - Task Detail Screen
 * View and edit task details
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTask } from '../contexts/TaskContext';
import { useGamification } from '../contexts/GamificationContext';
import { Task } from '../types';
import { TaskForm } from '../components/Task/TaskForm';
import { Button } from '../components/Common/Button';
import { Modal } from '../components/Common/Modal';
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
} from '../utils/constants';
import {
  formatDuration,
  formatDateTime,
  getRelativeDateString,
} from '../utils/dateHelpers';

type TaskDetailScreenProps = StackScreenProps<RootStackParamList, 'TaskDetail'>;

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { getTaskById, updateTask, deleteTask, completeTask } = useTask();
  const { addXP } = useGamification();

  const [task, setTask] = useState<Task | undefined>(getTaskById(taskId));
  const [isEditing, setIsEditing] = useState(false);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Task not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleUpdate = async (taskData: Partial<Task>) => {
    try {
      const updatedTask = { ...task, ...taskData };
      await updateTask(updatedTask);
      setTask(updatedTask);
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const handleComplete = async () => {
    try {
      const { task: completedTask, xpGained } = await completeTask(taskId);
      const leveledUp = await addXP(xpGained, completedTask.pomodorosCompleted);

      setTask(completedTask);

      if (leveledUp) {
        Alert.alert('Level Up!', 'Congratulations! You leveled up!');
      } else {
        Alert.alert('Task Completed!', `You earned ${xpGained} XP!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to complete task');
    }
  };

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

  if (isEditing) {
    return (
      <View style={styles.container}>
        <TaskForm
          task={task}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>{task.title}</Text>

      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>
          {task.status === 'todo'
            ? 'To Do'
            : task.status === 'in_progress'
            ? 'In Progress'
            : 'Completed'}
        </Text>
      </View>

      {/* Priority Bar */}
      <View style={[styles.priorityBar, { backgroundColor: getPriorityColor() }]}>
        <Text style={styles.priorityText}>
          {task.priority.toUpperCase()} PRIORITY
        </Text>
      </View>

      {/* Description */}
      {task.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>
      )}

      {/* Details Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{task.category}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Estimated Time</Text>
            <Text style={styles.detailValue}>{formatDuration(task.estimatedTime)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>XP Reward</Text>
            <Text style={[styles.detailValue, { color: COLORS.success }]}>
              +{task.xpReward} XP
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Pomodoros</Text>
            <Text style={styles.detailValue}>{task.pomodorosCompleted}</Text>
          </View>

          {task.deadline && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Deadline</Text>
              <Text style={styles.detailValue}>
                {getRelativeDateString(task.deadline)}
              </Text>
            </View>
          )}

          {task.isRecurring && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Recurring</Text>
              <Text style={styles.detailValue}>
                {task.recurringPattern || 'Yes'}
              </Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>
              {formatDateTime(task.createdAt)}
            </Text>
          </View>

          {task.completedAt && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Completed</Text>
              <Text style={styles.detailValue}>
                {formatDateTime(task.completedAt)}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Photos */}
      {task.photos && task.photos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos ({task.photos.length})</Text>
          <View style={styles.photosContainer}>
            {task.photos.map((photo, index) => (
              <View key={index} style={styles.photoPlaceholder}>
                <Text style={styles.photoText}>Photo {index + 1}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {task.status !== 'completed' && (
          <Button
            title="Complete Task"
            onPress={handleComplete}
            variant="success"
            fullWidth
            style={{ marginBottom: SPACING.md }}
          />
        )}

        <Button
          title="Start Pomodoro"
          onPress={() => {
            // TODO: Navigate to Pomodoro screen
            Alert.alert('Pomodoro', 'Pomodoro timer coming soon!');
          }}
          variant="primary"
          fullWidth
          style={{ marginBottom: SPACING.md }}
        />

        <Button
          title="Delete Task"
          onPress={handleDelete}
          variant="danger"
          fullWidth
        />
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
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  backButton: {
    padding: SPACING.sm,
  },
  backText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.primary,
    fontWeight: '600',
  },
  editText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.primary,
    fontWeight: '600',
    padding: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.heading,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
    lineHeight: 32,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.md,
  },
  statusText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    fontWeight: '600',
  },
  priorityBar: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.lg,
  },
  priorityText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    fontWeight: '700',
    textAlign: 'center',
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
  description: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  detailsGrid: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  detailLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textMuted,
  },
  detailValue: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontWeight: '600',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
  },
  actions: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  errorText: {
    fontSize: FONT_SIZES.large,
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
});

export default TaskDetailScreen;
