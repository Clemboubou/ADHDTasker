/**
 * ADHD Task Manager - Main App Component
 * Integrates all providers and navigation
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TaskProvider } from './src/contexts/TaskContext';
import { GamificationProvider } from './src/contexts/GamificationContext';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initNotifications } from './src/services/notifications';
import { COLORS } from './src/utils/constants';

function App() {
  useEffect(() => {
    // Initialize notifications on app start
    initNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />
      <SettingsProvider>
        <GamificationProvider>
          <TaskProvider>
            <AppNavigator />
          </TaskProvider>
        </GamificationProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

export default App;
