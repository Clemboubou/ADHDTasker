/**
 * ADHD Task Manager - App Navigator
 * Main navigation configuration
 */

import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS, FONT_SIZES } from '../utils/constants';

// Screens
import HomeScreen from '../screens/HomeScreen';
import TaskListScreen from '../screens/TaskListScreen';
import CalendarScreen from '../screens/CalendarScreen';
import TemplatesScreen from '../screens/TemplatesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';

export type RootTabParamList = {
  Home: undefined;
  Tasks: undefined;
  Calendar: undefined;
  Templates: undefined;
  History: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  TaskDetail: { taskId: string };
  TaskForm: { taskId?: string };
  PomodoroTimer: { taskId?: string };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Tab Navigator Component
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: COLORS.backgroundCard,
            borderTopColor: COLORS.backgroundLight,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: {
            fontSize: FONT_SIZES.small,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: COLORS.background,
            borderBottomColor: COLORS.backgroundLight,
            borderBottomWidth: 1,
          },
          headerTitleStyle: {
            fontSize: FONT_SIZES.title,
            fontWeight: '600',
            color: COLORS.text,
          },
          headerTintColor: COLORS.text,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Today Focus',
            tabBarIcon: ({ color }) => <TabIcon icon="🎯" color={color} />,
          }}
        />
        <Tab.Screen
          name="Tasks"
          component={TaskListScreen}
          options={{
            title: 'All Tasks',
            tabBarIcon: ({ color }) => <TabIcon icon="📋" color={color} />,
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => <TabIcon icon="📅" color={color} />,
          }}
        />
        <Tab.Screen
          name="Templates"
          component={TemplatesScreen}
          options={{
            title: 'Templates',
            tabBarIcon: ({ color }) => <TabIcon icon="📝" color={color} />,
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <TabIcon icon="📊" color={color} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <TabIcon icon="⚙️" color={color} />,
          }}
        />
      </Tab.Navigator>
  );
};

// Main App Navigator with Stack
export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{
            title: 'Task Details',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Simple emoji-based tab icon
const TabIcon: React.FC<{ icon: string; color: string }> = ({ icon }) => {
  return <Text style={{ fontSize: 24 }}>{icon}</Text>;
};
