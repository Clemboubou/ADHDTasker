/**
 * ADHD Task Manager - Database Service
 * SQLite database setup and operations
 */

import SQLite from 'react-native-sqlite-storage';
import { Task, Template, PomodoroSession, TaskChain, Category } from '../types';
import { DATABASE } from '../utils/constants';

// Enable debugging
SQLite.DEBUG(true);
SQLite.enablePromise(true);

let database: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize database and create tables
 */
export const initDatabase = async (): Promise<void> => {
  try {
    database = await SQLite.openDatabase({
      name: DATABASE.name,
      location: 'default',
    });

    console.log('Database opened successfully');

    // Create tables
    await createTables();
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Create all database tables
 */
const createTables = async (): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  const queries = [
    // Tasks table
    `CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      estimatedTime INTEGER NOT NULL,
      category TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      photos TEXT,
      createdAt TEXT NOT NULL,
      completedAt TEXT,
      deadline TEXT,
      xpReward INTEGER NOT NULL,
      pomodorosCompleted INTEGER DEFAULT 0,
      chainId TEXT,
      chainOrder INTEGER,
      nextTaskId TEXT,
      isRecurring INTEGER DEFAULT 0,
      recurringPattern TEXT
    )`,

    // Templates table
    `CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      tasks TEXT NOT NULL,
      isChained INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    )`,

    // Pomodoro sessions table
    `CREATE TABLE IF NOT EXISTS pomodoro_sessions (
      id TEXT PRIMARY KEY,
      taskId TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT,
      duration INTEGER NOT NULL,
      isCompleted INTEGER DEFAULT 0,
      isBreak INTEGER DEFAULT 0,
      FOREIGN KEY (taskId) REFERENCES tasks(id)
    )`,

    // Task chains table
    `CREATE TABLE IF NOT EXISTS task_chains (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      taskIds TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      currentTaskIndex INTEGER DEFAULT 0
    )`,

    // Categories table
    `CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      icon TEXT
    )`,

    // Create indexes for better query performance
    `CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`,
    `CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category)`,
    `CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)`,
    `CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline)`,
    `CREATE INDEX IF NOT EXISTS idx_tasks_chainId ON tasks(chainId)`,
    `CREATE INDEX IF NOT EXISTS idx_pomodoro_taskId ON pomodoro_sessions(taskId)`,
  ];

  for (const query of queries) {
    await database.executeSql(query);
  }
};

/**
 * Get database instance
 */
export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!database) throw new Error('Database not initialized');
  return database;
};

/**
 * Close database connection
 */
export const closeDatabase = async (): Promise<void> => {
  if (database) {
    await database.close();
    database = null;
    console.log('Database closed');
  }
};

/**
 * Clear all data from database (for testing/reset)
 */
export const clearAllData = async (): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  const tables = ['tasks', 'templates', 'pomodoro_sessions', 'task_chains', 'categories'];

  for (const table of tables) {
    await database.executeSql(`DELETE FROM ${table}`);
  }

  console.log('All data cleared from database');
};

// ==================== TASK OPERATIONS ====================

/**
 * Insert a new task
 */
export const insertTask = async (task: Task): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  const query = `
    INSERT INTO tasks (
      id, title, description, estimatedTime, category, priority, status,
      photos, createdAt, completedAt, deadline, xpReward, pomodorosCompleted,
      chainId, chainOrder, nextTaskId, isRecurring, recurringPattern
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await database.executeSql(query, [
    task.id,
    task.title,
    task.description || null,
    task.estimatedTime,
    task.category,
    task.priority,
    task.status,
    JSON.stringify(task.photos),
    task.createdAt.toISOString(),
    task.completedAt?.toISOString() || null,
    task.deadline?.toISOString() || null,
    task.xpReward,
    task.pomodorosCompleted || 0,
    task.chainId || null,
    task.chainOrder || null,
    task.nextTaskId || null,
    task.isRecurring ? 1 : 0,
    task.recurringPattern || null,
  ]);
};

/**
 * Update an existing task
 */
export const updateTask = async (task: Task): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  const query = `
    UPDATE tasks SET
      title = ?, description = ?, estimatedTime = ?, category = ?,
      priority = ?, status = ?, photos = ?, completedAt = ?,
      deadline = ?, xpReward = ?, pomodorosCompleted = ?,
      chainId = ?, chainOrder = ?, nextTaskId = ?,
      isRecurring = ?, recurringPattern = ?
    WHERE id = ?
  `;

  await database.executeSql(query, [
    task.title,
    task.description || null,
    task.estimatedTime,
    task.category,
    task.priority,
    task.status,
    JSON.stringify(task.photos),
    task.completedAt?.toISOString() || null,
    task.deadline?.toISOString() || null,
    task.xpReward,
    task.pomodorosCompleted || 0,
    task.chainId || null,
    task.chainOrder || null,
    task.nextTaskId || null,
    task.isRecurring ? 1 : 0,
    task.recurringPattern || null,
    task.id,
  ]);
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  await database.executeSql('DELETE FROM tasks WHERE id = ?', [taskId]);
};

/**
 * Get a task by ID
 */
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  if (!database) throw new Error('Database not initialized');

  const [result] = await database.executeSql(
    'SELECT * FROM tasks WHERE id = ?',
    [taskId]
  );

  if (result.rows.length === 0) return null;

  return mapTaskFromDB(result.rows.item(0));
};

/**
 * Get all tasks
 */
export const getAllTasks = async (): Promise<Task[]> => {
  if (!database) throw new Error('Database not initialized');

  const [result] = await database.executeSql('SELECT * FROM tasks ORDER BY createdAt DESC');

  const tasks: Task[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    tasks.push(mapTaskFromDB(result.rows.item(i)));
  }

  return tasks;
};

/**
 * Get tasks by status
 */
export const getTasksByStatus = async (status: string): Promise<Task[]> => {
  if (!database) throw new Error('Database not initialized');

  const [result] = await database.executeSql(
    'SELECT * FROM tasks WHERE status = ? ORDER BY createdAt DESC',
    [status]
  );

  const tasks: Task[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    tasks.push(mapTaskFromDB(result.rows.item(i)));
  }

  return tasks;
};

/**
 * Get tasks by category
 */
export const getTasksByCategory = async (category: string): Promise<Task[]> => {
  if (!database) throw new Error('Database not initialized');

  const [result] = await database.executeSql(
    'SELECT * FROM tasks WHERE category = ? ORDER BY createdAt DESC',
    [category]
  );

  const tasks: Task[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    tasks.push(mapTaskFromDB(result.rows.item(i)));
  }

  return tasks;
};

/**
 * Map database row to Task object
 */
const mapTaskFromDB = (row: any): Task => {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    estimatedTime: row.estimatedTime,
    category: row.category,
    priority: row.priority,
    status: row.status,
    photos: JSON.parse(row.photos || '[]'),
    createdAt: new Date(row.createdAt),
    completedAt: row.completedAt ? new Date(row.completedAt) : undefined,
    deadline: row.deadline ? new Date(row.deadline) : undefined,
    xpReward: row.xpReward,
    pomodorosCompleted: row.pomodorosCompleted || 0,
    chainId: row.chainId,
    chainOrder: row.chainOrder,
    nextTaskId: row.nextTaskId,
    isRecurring: row.isRecurring === 1,
    recurringPattern: row.recurringPattern,
  };
};

// ==================== CATEGORY OPERATIONS ====================

/**
 * Insert a new category
 */
export const insertCategory = async (category: Category): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  await database.executeSql(
    'INSERT INTO categories (id, name, color, icon) VALUES (?, ?, ?, ?)',
    [category.id, category.name, category.color, category.icon || null]
  );
};

/**
 * Get all categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
  if (!database) throw new Error('Database not initialized');

  const [result] = await database.executeSql('SELECT * FROM categories');

  const categories: Category[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    categories.push(result.rows.item(i));
  }

  return categories;
};

// ==================== TEMPLATE OPERATIONS ====================

/**
 * Insert a new template
 */
export const insertTemplate = async (template: Template): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  await database.executeSql(
    'INSERT INTO templates (id, name, description, tasks, isChained, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [
      template.id,
      template.name,
      template.description || null,
      JSON.stringify(template.tasks),
      template.isChained ? 1 : 0,
      template.createdAt.toISOString(),
    ]
  );
};

/**
 * Get all templates
 */
export const getAllTemplates = async (): Promise<Template[]> => {
  if (!database) throw new Error('Database not initialized');

  const [result] = await database.executeSql('SELECT * FROM templates ORDER BY createdAt DESC');

  const templates: Template[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    templates.push({
      id: row.id,
      name: row.name,
      description: row.description,
      tasks: JSON.parse(row.tasks),
      isChained: row.isChained === 1,
      createdAt: new Date(row.createdAt),
    });
  }

  return templates;
};

/**
 * Delete a template
 */
export const deleteTemplate = async (templateId: string): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  await database.executeSql('DELETE FROM templates WHERE id = ?', [templateId]);
};

// ==================== POMODORO SESSION OPERATIONS ====================

/**
 * Insert a new pomodoro session
 */
export const insertPomodoroSession = async (session: PomodoroSession): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  await database.executeSql(
    `INSERT INTO pomodoro_sessions (id, taskId, startTime, endTime, duration, isCompleted, isBreak)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      session.id,
      session.taskId,
      session.startTime.toISOString(),
      session.endTime?.toISOString() || null,
      session.duration,
      session.isCompleted ? 1 : 0,
      session.isBreak ? 1 : 0,
    ]
  );
};

/**
 * Get pomodoro sessions for a task
 */
export const getPomodoroSessionsByTask = async (taskId: string): Promise<PomodoroSession[]> => {
  if (!database) throw new Error('Database not initialized');

  const [result] = await database.executeSql(
    'SELECT * FROM pomodoro_sessions WHERE taskId = ? ORDER BY startTime DESC',
    [taskId]
  );

  const sessions: PomodoroSession[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    sessions.push({
      id: row.id,
      taskId: row.taskId,
      startTime: new Date(row.startTime),
      endTime: row.endTime ? new Date(row.endTime) : undefined,
      duration: row.duration,
      isCompleted: row.isCompleted === 1,
      isBreak: row.isBreak === 1,
    });
  }

  return sessions;
};

export default {
  initDatabase,
  closeDatabase,
  clearAllData,
  insertTask,
  updateTask,
  deleteTask,
  getTaskById,
  getAllTasks,
  getTasksByStatus,
  getTasksByCategory,
  insertCategory,
  getAllCategories,
  insertTemplate,
  getAllTemplates,
  deleteTemplate,
  insertPomodoroSession,
  getPomodoroSessionsByTask,
};
