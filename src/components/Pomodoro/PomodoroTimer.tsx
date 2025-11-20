/**
 * ADHD Task Manager - Pomodoro Timer Component
 * Full-featured Pomodoro timer with background support
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import { useSettings } from '../../contexts/SettingsContext';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  taskId?: string;
  onSessionComplete?: (isBreak: boolean) => void;
  onPomodoroComplete?: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  taskId: _taskId,
  onSessionComplete,
  onPomodoroComplete,
}) => {
  const { settings } = useSettings();

  const [mode, setMode] = useState<TimerMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState(settings.pomodoroDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        BackgroundTimer.clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Update timer when mode changes
    switch (mode) {
      case 'focus':
        setSecondsLeft(settings.pomodoroDuration * 60);
        break;
      case 'shortBreak':
        setSecondsLeft(settings.shortBreakDuration * 60);
        break;
      case 'longBreak':
        setSecondsLeft(settings.longBreakDuration * 60);
        break;
    }
  }, [mode, settings]);

  const startTimer = () => {
    if (intervalRef.current) return;

    setIsRunning(true);

    intervalRef.current = BackgroundTimer.setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      BackgroundTimer.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const resetTimer = () => {
    pauseTimer();
    switch (mode) {
      case 'focus':
        setSecondsLeft(settings.pomodoroDuration * 60);
        break;
      case 'shortBreak':
        setSecondsLeft(settings.shortBreakDuration * 60);
        break;
      case 'longBreak':
        setSecondsLeft(settings.longBreakDuration * 60);
        break;
    }
  };

  const handleTimerComplete = () => {
    pauseTimer();

    // Vibrate
    Vibration.vibrate([0, 500, 200, 500]);

    // Play sound if enabled
    if (settings.enableSounds) {
      // TODO: Play notification sound
    }

    const isBreak = mode !== 'focus';

    if (mode === 'focus') {
      // Focus session completed
      const newCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCount);

      if (onPomodoroComplete) {
        onPomodoroComplete();
      }

      // Decide next mode
      if (newCount % settings.pomodorosUntilLongBreak === 0) {
        Alert.alert(
          'Focus Complete!',
          'Great work! Time for a long break.',
          [{ text: 'Start Long Break', onPress: () => setMode('longBreak') }]
        );
      } else {
        Alert.alert(
          'Focus Complete!',
          'Well done! Take a short break.',
          [{ text: 'Start Short Break', onPress: () => setMode('shortBreak') }]
        );
      }
    } else {
      // Break completed
      Alert.alert(
        'Break Complete!',
        'Ready to focus again?',
        [{ text: 'Start Focus', onPress: () => setMode('focus') }]
      );
    }

    if (onSessionComplete) {
      onSessionComplete(isBreak);
    }
  };

  const skipSession = () => {
    Alert.alert(
      'Skip Session',
      'Are you sure you want to skip this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => {
            pauseTimer();
            if (mode === 'focus') {
              setMode('shortBreak');
            } else {
              setMode('focus');
            }
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    const totalSeconds =
      mode === 'focus'
        ? settings.pomodoroDuration * 60
        : mode === 'shortBreak'
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60;

    return (totalSeconds - secondsLeft) / totalSeconds;
  };

  const getModeColor = (): string => {
    switch (mode) {
      case 'focus':
        return COLORS.primary;
      case 'shortBreak':
        return COLORS.success;
      case 'longBreak':
        return COLORS.warning;
      default:
        return COLORS.primary;
    }
  };

  const getModeTitle = (): string => {
    switch (mode) {
      case 'focus':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  return (
    <View style={styles.container}>
      {/* Mode Title */}
      <Text style={styles.modeTitle}>{getModeTitle()}</Text>

      {/* Pomodoros Counter */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          🍅 {pomodorosCompleted} Pomodoro{pomodorosCompleted !== 1 ? 's' : ''} completed
        </Text>
      </View>

      {/* Timer Display */}
      <View style={[styles.timerCircle, { borderColor: getModeColor() }]}>
        <View style={styles.timerInner}>
          <Text style={[styles.timerText, { color: getModeColor() }]}>
            {formatTime(secondsLeft)}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${getProgress() * 100}%`,
                  backgroundColor: getModeColor(),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity
            style={[styles.mainButton, { backgroundColor: getModeColor() }]}
            onPress={startTimer}
          >
            <Text style={styles.mainButtonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.mainButton, { backgroundColor: COLORS.warning }]}
            onPress={pauseTimer}
          >
            <Text style={styles.mainButtonText}>Pause</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Secondary Controls */}
      <View style={styles.secondaryControls}>
        <TouchableOpacity style={styles.secondaryButton} onPress={resetTimer}>
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={skipSession}>
          <Text style={styles.secondaryButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === 'focus' && styles.modeButtonActive,
          ]}
          onPress={() => {
            if (!isRunning) setMode('focus');
          }}
          disabled={isRunning}
        >
          <Text
            style={[
              styles.modeButtonText,
              mode === 'focus' && styles.modeButtonTextActive,
            ]}
          >
            Focus
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === 'shortBreak' && styles.modeButtonActive,
          ]}
          onPress={() => {
            if (!isRunning) setMode('shortBreak');
          }}
          disabled={isRunning}
        >
          <Text
            style={[
              styles.modeButtonText,
              mode === 'shortBreak' && styles.modeButtonTextActive,
            ]}
          >
            Short Break
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === 'longBreak' && styles.modeButtonActive,
          ]}
          onPress={() => {
            if (!isRunning) setMode('longBreak');
          }}
          disabled={isRunning}
        >
          <Text
            style={[
              styles.modeButtonText,
              mode === 'longBreak' && styles.modeButtonTextActive,
            ]}
          >
            Long Break
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeTitle: {
    fontSize: FONT_SIZES.heading,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  counterContainer: {
    marginBottom: SPACING.xl,
  },
  counterText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  timerInner: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: FONT_SIZES.timerLarge,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  progressBar: {
    width: 200,
    height: 8,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  controls: {
    marginBottom: SPACING.lg,
  },
  mainButton: {
    paddingHorizontal: 80,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainButtonText: {
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    color: COLORS.text,
  },
  secondaryControls: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  secondaryButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.backgroundCard,
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  modeSelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xs,
  },
  modeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  modeButtonText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
});
