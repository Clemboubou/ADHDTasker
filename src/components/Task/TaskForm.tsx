/**
 * ADHD Task Manager - Task Form Component
 * Form for creating and editing tasks
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Task, Priority, TaskStatus, RecurringPattern } from '../../types';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { useSettings } from '../../contexts/SettingsContext';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: Partial<Task>) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const { categories } = useSettings();

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [estimatedTime, setEstimatedTime] = useState(task?.estimatedTime?.toString() || '30');
  const [category, setCategory] = useState(task?.category || categories[0]?.id || 'personal');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'todo');
  const [photos, setPhotos] = useState<string[]>(task?.photos || []);
  const [deadline, _setDeadline] = useState<Date | undefined>(task?.deadline);
  const [isRecurring, setIsRecurring] = useState(task?.isRecurring || false);
  const [recurringPattern, setRecurringPattern] = useState<RecurringPattern>(
    task?.recurringPattern || 'none'
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    const timeNum = parseInt(estimatedTime, 10);
    if (isNaN(timeNum) || timeNum <= 0) {
      newErrors.estimatedTime = 'Please enter a valid time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const taskData: Partial<Task> = {
      title: title.trim(),
      description: description.trim() || undefined,
      estimatedTime: parseInt(estimatedTime, 10),
      category,
      priority,
      status,
      photos,
      deadline,
      isRecurring,
      recurringPattern: isRecurring ? recurringPattern : undefined,
    };

    onSubmit(taskData);
  };

  const handleAddPhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 5 - photos.length,
      });

      if (result.assets) {
        const newPhotos = result.assets.map(asset => asset.uri || '').filter(uri => uri);
        setPhotos([...photos, ...newPhotos]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const renderPriorityButton = (priorityValue: Priority, label: string) => (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        priority === priorityValue && styles.priorityButtonActive,
        { borderColor: getPriorityColor(priorityValue) },
      ]}
      onPress={() => setPriority(priorityValue)}
    >
      <Text
        style={[
          styles.priorityText,
          priority === priorityValue && styles.priorityTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'high':
        return COLORS.priorityHigh;
      case 'medium':
        return COLORS.priorityMedium;
      default:
        return COLORS.priorityLow;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.formTitle}>{task ? 'Edit Task' : 'New Task'}</Text>

      {/* Title */}
      <Input
        label="Title *"
        value={title}
        onChangeText={setTitle}
        placeholder="What needs to be done?"
        error={errors.title}
      />

      {/* Description */}
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Add more details..."
        multiline
        numberOfLines={4}
      />

      {/* Estimated Time */}
      <Input
        label="Estimated Time (minutes) *"
        value={estimatedTime}
        onChangeText={setEstimatedTime}
        placeholder="30"
        keyboardType="numeric"
        error={errors.estimatedTime}
      />

      {/* Priority */}
      <View style={styles.section}>
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityContainer}>
          {renderPriorityButton('low', 'Low')}
          {renderPriorityButton('medium', 'Medium')}
          {renderPriorityButton('high', 'High')}
        </View>
      </View>

      {/* Category */}
      <View style={styles.section}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                category === cat.id && styles.categoryButtonActive,
                { borderColor: cat.color },
              ]}
              onPress={() => setCategory(cat.id)}
            >
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <Text
                style={[
                  styles.categoryText,
                  category === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Status (only for editing) */}
      {task && (
        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map(s => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusButton,
                  status === s && styles.statusButtonActive,
                ]}
                onPress={() => setStatus(s)}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === s && styles.statusTextActive,
                  ]}
                >
                  {s === 'todo' ? 'To Do' : s === 'in_progress' ? 'In Progress' : 'Completed'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Recurring */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setIsRecurring(!isRecurring)}
        >
          <View style={[styles.checkbox, isRecurring && styles.checkboxChecked]}>
            {isRecurring && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Recurring Task</Text>
        </TouchableOpacity>

        {isRecurring && (
          <View style={styles.recurringOptions}>
            {(['daily', 'weekly', 'monthly'] as RecurringPattern[]).map(pattern => (
              <TouchableOpacity
                key={pattern}
                style={[
                  styles.recurringButton,
                  recurringPattern === pattern && styles.recurringButtonActive,
                ]}
                onPress={() => setRecurringPattern(pattern)}
              >
                <Text
                  style={[
                    styles.recurringText,
                    recurringPattern === pattern && styles.recurringTextActive,
                  ]}
                >
                  {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Photos */}
      <View style={styles.section}>
        <Text style={styles.label}>Photos ({photos.length}/5)</Text>
        {photos.length < 5 && (
          <Button
            title="Add Photo"
            onPress={handleAddPhoto}
            variant="secondary"
            size="small"
          />
        )}
        {photos.length > 0 && (
          <View style={styles.photosContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <Text style={styles.photoText} numberOfLines={1}>
                  Photo {index + 1}
                </Text>
                <TouchableOpacity onPress={() => handleRemovePhoto(index)}>
                  <Text style={styles.removePhoto}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="secondary"
          style={{ flex: 1 }}
        />
        <View style={{ width: SPACING.md }} />
        <Button
          title={task ? 'Update' : 'Create'}
          onPress={handleSubmit}
          variant="primary"
          style={{ flex: 1 }}
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
  formTitle: {
    fontSize: FONT_SIZES.heading,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 2,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: COLORS.backgroundLight,
  },
  priorityText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  priorityTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 2,
    backgroundColor: COLORS.backgroundCard,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.backgroundLight,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  categoryText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statusButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 2,
    borderColor: COLORS.backgroundLight,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
  },
  statusButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.backgroundLight,
  },
  statusText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statusTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.small,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.text,
    fontSize: FONT_SIZES.medium,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
  recurringOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  recurringButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 2,
    borderColor: COLORS.backgroundLight,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
  },
  recurringButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.backgroundLight,
  },
  recurringText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
  recurringTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  photosContainer: {
    marginTop: SPACING.md,
  },
  photoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.sm,
  },
  photoText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    flex: 1,
  },
  removePhoto: {
    fontSize: FONT_SIZES.large,
    color: COLORS.danger,
    fontWeight: '600',
    padding: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
});
