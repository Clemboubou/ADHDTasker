/**
 * ADHD Task Manager - Templates Screen
 * Manage and use task templates/routines
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { Template, Task } from '../types';
import { useTask } from '../contexts/TaskContext';
import * as Database from '../services/database';
import { Button } from '../components/Common/Button';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../utils/constants';

// Pre-made templates
const DEFAULT_TEMPLATES: Omit<Template, 'id' | 'createdAt'>[] = [
  {
    name: 'Morning Routine',
    description: 'Start your day right',
    isChained: true,
    tasks: [
      {
        title: 'Wake up and make bed',
        estimatedTime: 5,
        category: 'personal',
        priority: 'medium',
        status: 'todo',
        photos: [],
        xpReward: 20,
        pomodorosCompleted: 0,
        isRecurring: true,
        recurringPattern: 'daily',
      },
      {
        title: 'Morning exercise',
        estimatedTime: 20,
        category: 'health',
        priority: 'high',
        status: 'todo',
        photos: [],
        xpReward: 50,
        pomodorosCompleted: 0,
        isRecurring: true,
        recurringPattern: 'daily',
      },
      {
        title: 'Healthy breakfast',
        estimatedTime: 15,
        category: 'health',
        priority: 'high',
        status: 'todo',
        photos: [],
        xpReward: 30,
        pomodorosCompleted: 0,
        isRecurring: true,
        recurringPattern: 'daily',
      },
      {
        title: 'Review daily goals',
        estimatedTime: 10,
        category: 'personal',
        priority: 'high',
        status: 'todo',
        photos: [],
        xpReward: 40,
        pomodorosCompleted: 0,
        isRecurring: true,
        recurringPattern: 'daily',
      },
    ],
  },
  {
    name: 'Job Search Routine',
    description: 'Daily job hunting tasks',
    isChained: false,
    tasks: [
      {
        title: 'Update resume/CV',
        estimatedTime: 30,
        category: 'work',
        priority: 'high',
        status: 'todo',
        photos: [],
        xpReward: 60,
        pomodorosCompleted: 0,
        isRecurring: false,
      },
      {
        title: 'Search for job openings',
        estimatedTime: 45,
        category: 'work',
        priority: 'high',
        status: 'todo',
        photos: [],
        xpReward: 80,
        pomodorosCompleted: 0,
        isRecurring: true,
        recurringPattern: 'daily',
      },
      {
        title: 'Apply to 3 jobs',
        estimatedTime: 60,
        category: 'work',
        priority: 'high',
        status: 'todo',
        photos: [],
        xpReward: 120,
        pomodorosCompleted: 0,
        isRecurring: true,
        recurringPattern: 'daily',
      },
      {
        title: 'Network on LinkedIn',
        estimatedTime: 20,
        category: 'work',
        priority: 'medium',
        status: 'todo',
        photos: [],
        xpReward: 40,
        pomodorosCompleted: 0,
        isRecurring: true,
        recurringPattern: 'daily',
      },
    ],
  },
  {
    name: 'Evening Wind-down',
    description: 'Relax and prepare for tomorrow',
    isChained: true,
    tasks: [
      {
        title: 'Review completed tasks',
        estimatedTime: 10,
        category: 'personal',
        priority: 'medium',
        status: 'todo',
        photos: [],
        xpReward: 30,
        pomodorosCompleted: 0,
        isRecurring: true,
        recurringPattern: 'daily',
      },
      {
        title: 'Plan tomorrow',
        estimatedTime: 15,
        category: 'personal',
        priority: 'high',
        status: 'todo',
        photos: [],
        xpReward: 40,
        pomodorosCompleted: 0,
        isRecurring: true,
        recurringPattern: 'daily',
      },
      {
        title: 'Relaxation/meditation',
        estimatedTime: 20,
        category: 'health',
        priority: 'medium',
        status: 'todo',
        photos: [],
        xpReward: 50,
        pomodorosCompleted: 0,
        isRecurring: true,
        recurringPattern: 'daily',
      },
      {
        title: 'Prepare for bed',
        estimatedTime: 15,
        category: 'personal',
        priority: 'medium',
        status: 'todo',
        photos: [],
        xpReward: 30,
        pomodorosCompleted: 0,
        isRecurring: true,
        recurringPattern: 'daily',
      },
    ],
  },
  {
    name: 'Deep Work Session',
    description: 'Focused work block',
    isChained: false,
    tasks: [
      {
        title: 'Clear workspace',
        estimatedTime: 5,
        category: 'work',
        priority: 'medium',
        status: 'todo',
        photos: [],
        xpReward: 15,
        pomodorosCompleted: 0,
        isRecurring: false,
      },
      {
        title: 'Deep work - 2 hours',
        estimatedTime: 120,
        category: 'work',
        priority: 'high',
        status: 'todo',
        photos: [],
        xpReward: 250,
        pomodorosCompleted: 0,
        isRecurring: false,
      },
      {
        title: 'Document progress',
        estimatedTime: 15,
        category: 'work',
        priority: 'medium',
        status: 'todo',
        photos: [],
        xpReward: 35,
        pomodorosCompleted: 0,
        isRecurring: false,
      },
    ],
  },
];

const TemplatesScreen: React.FC = () => {
  const { createTask } = useTask();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const loadedTemplates = await Database.getAllTemplates();
      setTemplates(loadedTemplates);
    } catch (_error) {
      console.error('Error loading templates:', _error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDefaultTemplates = async () => {
    try {
      for (const templateData of DEFAULT_TEMPLATES) {
        const template: Template = {
          ...templateData,
          id: uuidv4(),
          createdAt: new Date(),
        };
        await Database.insertTemplate(template);
      }
      await loadTemplates();
      Alert.alert('Success', 'Default templates created!');
    } catch (_error) {
      Alert.alert('Error', 'Failed to create default templates');
    }
  };

  const handleUseTemplate = async (template: Template) => {
    Alert.alert(
      'Use Template',
      `Create ${template.tasks.length} tasks from "${template.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create Tasks',
          onPress: async () => {
            try {
              let previousTaskId: string | undefined;

              for (let i = 0; i < template.tasks.length; i++) {
                const taskTemplate = template.tasks[i];
                const newTaskId = uuidv4();

                // Remove fields that createTask will generate
                const { xpReward: _xpReward, pomodorosCompleted: _pomodorosCompleted, ...taskData } = taskTemplate;

                // Prepare task data for creation
                let newTaskData: Omit<Task, 'id' | 'createdAt' | 'xpReward' | 'pomodorosCompleted'> = {
                  ...taskData,
                };

                // If template is chained, link tasks
                if (template.isChained) {
                  newTaskData = {
                    ...newTaskData,
                    chainId: template.id,
                    chainOrder: i,
                  };
                }

                await createTask(newTaskData);

                // Update previous task's nextTaskId
                if (template.isChained && previousTaskId) {
                  // TODO: Update previous task with nextTaskId
                  // This would require updating the task in the database
                }

                previousTaskId = newTaskId;
              }

              Alert.alert(
                'Success',
                `Created ${template.tasks.length} tasks from template!`
              );
            } catch (_error) {
              Alert.alert('Error', 'Failed to create tasks from template');
            }
          },
        },
      ]
    );
  };

  const handleDeleteTemplate = async (templateId: string) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await Database.deleteTemplate(templateId);
              await loadTemplates();
            } catch (_error) {
              Alert.alert('Error', 'Failed to delete template');
            }
          },
        },
      ]
    );
  };

  const renderTemplate = ({ item }: { item: Template }) => (
    <View style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <View style={styles.templateInfo}>
          <Text style={styles.templateName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.templateDescription}>{item.description}</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteTemplate(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.templateStats}>
        <Text style={styles.statText}>
          📝 {item.tasks.length} task{item.tasks.length !== 1 ? 's' : ''}
        </Text>
        {item.isChained && <Text style={styles.statText}>🔗 Chained</Text>}
        <Text style={styles.statText}>
          ⏱️ {item.tasks.reduce((sum, t) => sum + t.estimatedTime, 0)} min total
        </Text>
      </View>

      <Button
        title="Use Template"
        onPress={() => handleUseTemplate(item)}
        variant="primary"
        size="small"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {templates.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyText}>No Templates Yet</Text>
          <Text style={styles.emptySubtext}>
            Create task templates to quickly add common routines
          </Text>
          <Button
            title="Create Default Templates"
            onPress={handleCreateDefaultTemplates}
            style={{ marginTop: SPACING.lg }}
          />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Task Templates</Text>
            <Text style={styles.subtitle}>
              {templates.length} template{templates.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <FlatList
            data={templates}
            keyExtractor={item => item.id}
            renderItem={renderTemplate}
            contentContainerStyle={styles.listContainer}
          />

          {templates.length > 0 && (
            <Button
              title="Add Default Templates"
              onPress={handleCreateDefaultTemplates}
              variant="secondary"
              style={styles.addButton}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  title: {
    fontSize: FONT_SIZES.heading,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  listContainer: {
    padding: SPACING.md,
  },
  templateCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.backgroundLight,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  templateDescription: {
    fontSize: FONT_SIZES.regular,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  deleteText: {
    fontSize: FONT_SIZES.large,
    color: COLORS.danger,
    fontWeight: '600',
  },
  templateStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
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
  addButton: {
    margin: SPACING.lg,
  },
});

export default TemplatesScreen;
