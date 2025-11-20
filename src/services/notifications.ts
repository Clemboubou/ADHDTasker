/**
 * ADHD Task Manager - Notification Service
 * Handle all app notifications
 */

import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform } from 'react-native';
import { NOTIFICATION_CHANNELS } from '../utils/constants';

/**
 * Initialize notification system
 */
export const initNotifications = (): void => {
  // Configure push notifications
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });

  // Create notification channels (Android)
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: NOTIFICATION_CHANNELS.TASK_REMINDERS,
        channelName: 'Task Reminders',
        channelDescription: 'Reminders for your tasks',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`Channel ${NOTIFICATION_CHANNELS.TASK_REMINDERS} created:`, created)
    );

    PushNotification.createChannel(
      {
        channelId: NOTIFICATION_CHANNELS.POMODORO,
        channelName: 'Pomodoro Timer',
        channelDescription: 'Pomodoro timer notifications',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`Channel ${NOTIFICATION_CHANNELS.POMODORO} created:`, created)
    );

    PushNotification.createChannel(
      {
        channelId: NOTIFICATION_CHANNELS.DAILY_MOTIVATION,
        channelName: 'Daily Motivation',
        channelDescription: 'Daily motivational messages',
        playSound: true,
        soundName: 'default',
        importance: Importance.DEFAULT,
        vibrate: false,
      },
      (created) => console.log(`Channel ${NOTIFICATION_CHANNELS.DAILY_MOTIVATION} created:`, created)
    );

    PushNotification.createChannel(
      {
        channelId: NOTIFICATION_CHANNELS.STREAK_WARNING,
        channelName: 'Streak Warnings',
        channelDescription: 'Alerts when your streak is in danger',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`Channel ${NOTIFICATION_CHANNELS.STREAK_WARNING} created:`, created)
    );
  }
};

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    return true; // Permissions are requested in configure on Android
  }

  // For iOS
  return new Promise((resolve) => {
    PushNotification.checkPermissions((permissions) => {
      if (permissions.alert && permissions.badge && permissions.sound) {
        resolve(true);
      } else {
        PushNotification.requestPermissions().then(() => resolve(true));
      }
    });
  });
};

/**
 * Schedule a task reminder notification
 */
export const scheduleTaskReminder = (
  taskId: string,
  title: string,
  message: string,
  date: Date,
  isPersistent: boolean = false
): void => {
  PushNotification.localNotificationSchedule({
    channelId: NOTIFICATION_CHANNELS.TASK_REMINDERS,
    id: taskId,
    title,
    message,
    date,
    allowWhileIdle: true,
    ongoing: isPersistent,
    invokeApp: true,
    userInfo: {
      taskId,
      type: 'task_reminder',
    },
    actions: ['Complete', 'Snooze'],
  });
};

/**
 * Cancel a scheduled task reminder
 */
export const cancelTaskReminder = (taskId: string): void => {
  PushNotification.cancelLocalNotification(taskId);
};

/**
 * Show Pomodoro completion notification
 */
export const showPomodoroCompleteNotification = (
  isBreak: boolean,
  nextMode: string
): void => {
  PushNotification.localNotification({
    channelId: NOTIFICATION_CHANNELS.POMODORO,
    title: isBreak ? 'Break Complete!' : 'Focus Session Complete!',
    message: isBreak
      ? `Great! Ready to focus again? Starting ${nextMode}`
      : `Awesome work! Time for a ${nextMode}`,
    playSound: true,
    soundName: 'default',
    vibrate: true,
    vibration: 1000,
    ongoing: false,
    invokeApp: true,
    userInfo: {
      type: 'pomodoro_complete',
      isBreak,
    },
    actions: isBreak ? ['Start Focus'] : ['Start Break'],
  });
};

/**
 * Show daily motivation notification
 */
export const scheduleDailyMotivation = (hour: number, minute: number): void => {
  const motivationalMessages = [
    'Time to conquer your tasks! 🚀',
    'You got this! Let\'s be productive today! 💪',
    'Every task completed is a step forward! 🎯',
    'Focus on progress, not perfection! ⭐',
    'Your future self will thank you! 🌟',
    'Small steps lead to big achievements! 🏆',
  ];

  const randomMessage =
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(0);

  // If time has passed today, schedule for tomorrow
  if (date < new Date()) {
    date.setDate(date.getDate() + 1);
  }

  PushNotification.localNotificationSchedule({
    channelId: NOTIFICATION_CHANNELS.DAILY_MOTIVATION,
    id: 'daily_motivation',
    title: 'Good Morning!',
    message: randomMessage,
    date,
    repeatType: 'day',
    allowWhileIdle: true,
    invokeApp: false,
  });
};

/**
 * Cancel daily motivation notification
 */
export const cancelDailyMotivation = (): void => {
  PushNotification.cancelLocalNotification('daily_motivation');
};

/**
 * Show streak warning notification
 */
export const showStreakWarningNotification = (currentStreak: number): void => {
  PushNotification.localNotification({
    channelId: NOTIFICATION_CHANNELS.STREAK_WARNING,
    title: '🔥 Your Streak is in Danger!',
    message: `Don't lose your ${currentStreak} day streak! Complete at least one task today.`,
    playSound: true,
    soundName: 'default',
    vibrate: true,
    ongoing: true,
    invokeApp: true,
    userInfo: {
      type: 'streak_warning',
    },
    actions: ['Open App'],
  });
};

/**
 * Show task completed notification with XP
 */
export const showTaskCompletedNotification = (
  taskTitle: string,
  xpGained: number,
  leveledUp: boolean = false
): void => {
  PushNotification.localNotification({
    channelId: NOTIFICATION_CHANNELS.TASK_REMINDERS,
    title: leveledUp ? '🎉 Level Up!' : '✅ Task Completed!',
    message: leveledUp
      ? `${taskTitle} completed! You leveled up and gained ${xpGained} XP!`
      : `${taskTitle} completed! +${xpGained} XP`,
    playSound: true,
    soundName: 'default',
    vibrate: leveledUp,
    vibration: leveledUp ? 1000 : 300,
    ongoing: false,
    invokeApp: false,
  });
};

/**
 * Show urgent task notification
 */
export const showUrgentTaskNotification = (taskTitle: string, deadline: Date): void => {
  const hoursLeft = Math.floor((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60));

  PushNotification.localNotification({
    channelId: NOTIFICATION_CHANNELS.TASK_REMINDERS,
    title: '⚠️ Urgent Task!',
    message: `"${taskTitle}" is due in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}!`,
    playSound: true,
    soundName: 'default',
    vibrate: true,
    ongoing: true,
    invokeApp: true,
    userInfo: {
      type: 'urgent_task',
    },
    actions: ['View Task', 'Dismiss'],
  });
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = (): void => {
  PushNotification.cancelAllLocalNotifications();
};

/**
 * Get scheduled notifications
 */
export const getScheduledNotifications = (): Promise<any[]> => {
  return new Promise((resolve) => {
    PushNotification.getScheduledLocalNotifications((notifications) => {
      resolve(notifications);
    });
  });
};

export default {
  initNotifications,
  requestNotificationPermissions,
  scheduleTaskReminder,
  cancelTaskReminder,
  showPomodoroCompleteNotification,
  scheduleDailyMotivation,
  cancelDailyMotivation,
  showStreakWarningNotification,
  showTaskCompletedNotification,
  showUrgentTaskNotification,
  clearAllNotifications,
  getScheduledNotifications,
};
