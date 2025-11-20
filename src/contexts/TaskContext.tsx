/**
 * ADHD Task Manager - Task Context
 * Global state management for tasks
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskFilters, Priority, TaskStatus } from '../types';
import * as Database from '../services/database';
import { calculateTaskXP } from '../utils/xpCalculator';
import { isDeadlineUrgent } from '../utils/dateHelpers';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  // CRUD operations
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'xpReward' | 'pomodorosCompleted'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<{ task: Task; xpGained: number }>;

  // Queries
  getTaskById: (taskId: string) => Task | undefined;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByCategory: (category: string) => Task[];
  getTodayTasks: () => Task[];
  getUrgentTasks: () => Task[];

  // Filters
  filterTasks: (filters: TaskFilters) => Task[];

  // Refresh
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize database and load tasks
  useEffect(() => {
    initializeTasks();
  }, []);

  const initializeTasks = async () => {
    try {
      setLoading(true);
      await Database.initDatabase();
      const loadedTasks = await Database.getAllTasks();
      setTasks(loadedTasks);
      setError(null);
    } catch (err) {
      console.error('Error initializing tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new task
   */
  const createTask = async (
    taskData: Omit<Task, 'id' | 'createdAt' | 'xpReward' | 'pomodorosCompleted'>
  ): Promise<void> => {
    try {
      const isUrgent = taskData.deadline ? isDeadlineUrgent(taskData.deadline) : false;

      const newTask: Task = {
        ...taskData,
        id: uuidv4(),
        createdAt: new Date(),
        xpReward: calculateTaskXP(
          taskData.estimatedTime,
          taskData.priority,
          isUrgent,
          0 // streak will be calculated from context
        ),
        pomodorosCompleted: 0,
      };

      await Database.insertTask(newTask);
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      console.error('Error creating task:', err);
      throw new Error('Failed to create task');
    }
  };

  /**
   * Update an existing task
   */
  const updateTask = async (task: Task): Promise<void> => {
    try {
      // Recalculate XP if relevant fields changed
      const isUrgent = task.deadline ? isDeadlineUrgent(task.deadline) : false;
      task.xpReward = calculateTaskXP(
        task.estimatedTime,
        task.priority,
        isUrgent,
        0
      );

      await Database.updateTask(task);
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    } catch (err) {
      console.error('Error updating task:', err);
      throw new Error('Failed to update task');
    }
  };

  /**
   * Delete a task
   */
  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      await Database.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw new Error('Failed to delete task');
    }
  };

  /**
   * Complete a task
   */
  const completeTask = async (taskId: string): Promise<{ task: Task; xpGained: number }> => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      const updatedTask: Task = {
        ...task,
        status: 'completed',
        completedAt: new Date(),
      };

      await Database.updateTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

      return {
        task: updatedTask,
        xpGained: updatedTask.xpReward,
      };
    } catch (err) {
      console.error('Error completing task:', err);
      throw new Error('Failed to complete task');
    }
  };

  /**
   * Get task by ID
   */
  const getTaskById = (taskId: string): Task | undefined => {
    return tasks.find(t => t.id === taskId);
  };

  /**
   * Get tasks by status
   */
  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter(t => t.status === status);
  };

  /**
   * Get tasks by category
   */
  const getTasksByCategory = (category: string): Task[] => {
    return tasks.filter(t => t.category === category);
  };

  /**
   * Get today's tasks (status: todo or in_progress)
   */
  const getTodayTasks = (): Task[] => {
    return tasks.filter(t => t.status === 'todo' || t.status === 'in_progress');
  };

  /**
   * Get urgent tasks (high priority or deadline within 24h)
   */
  const getUrgentTasks = (): Task[] => {
    return tasks.filter(t => {
      if (t.status === 'completed') return false;
      if (t.priority === 'high') return true;
      if (t.deadline && isDeadlineUrgent(t.deadline)) return true;
      return false;
    });
  };

  /**
   * Filter tasks based on criteria
   */
  const filterTasks = (filters: TaskFilters): Task[] => {
    let filtered = [...tasks];

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(t => filters.status!.includes(t.status));
    }

    // Filter by priority
    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(t => filters.priority!.includes(t.priority));
    }

    // Filter by category
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(t => filters.category!.includes(t.category));
    }

    // Filter by date range
    if (filters.dateRange) {
      filtered = filtered.filter(t => {
        const taskDate = t.deadline || t.createdAt;
        return taskDate >= filters.dateRange!.start && taskDate <= filters.dateRange!.end;
      });
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  /**
   * Refresh tasks from database
   */
  const refreshTasks = async (): Promise<void> => {
    try {
      setLoading(true);
      const loadedTasks = await Database.getAllTasks();
      setTasks(loadedTasks);
      setError(null);
    } catch (err) {
      console.error('Error refreshing tasks:', err);
      setError('Failed to refresh tasks');
    } finally {
      setLoading(false);
    }
  };

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    getTaskById,
    getTasksByStatus,
    getTasksByCategory,
    getTodayTasks,
    getUrgentTasks,
    filterTasks,
    refreshTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
