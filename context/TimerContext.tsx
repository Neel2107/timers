import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
export interface TimerAlert {
  percentage: number
  triggered: boolean
}
export interface Timer {
  id: number;
  name: string;
  duration: number;
  category: string;
  status: 'running' | 'paused' | 'completed';
  remainingTime: number;
  alerts: TimerAlert[]
}

export interface TimerHistoryItem {
  id: number;
  name: string;
  category: string;
  duration: number;
  completedAt: string;
}

interface TimerContextType {
  timers: Timer[]
  addTimer: (timer: Omit<Timer, 'id' | 'status' | 'remainingTime'>) => void
  loadTimers: () => Promise<void>
  startTimer: (id: number) => void
  pauseTimer: (id: number) => void
  resetTimer: (id: number) => void
  updateTimerStatus: (id: number, status: Timer['status']) => void
  updateRemainingTime: (id: number, time: number) => void
  history: TimerHistoryItem[];
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  startCategoryTimers: (category: string) => void;
  pauseCategoryTimers: (category: string) => void;
  resetCategoryTimers: (category: string) => void;
  showCompletionModal: boolean;
  setShowCompletionModal: (show: boolean) => void;
  completedTimerName: string;
  setCompletedTimerName: (name: string) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [history, setHistory] = useState<TimerHistoryItem[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completedTimerName, setCompletedTimerName] = useState('')

  // Add load history function
  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('timer_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  // Load both timers and history on mount
  useEffect(() => {
    loadTimers();
    loadHistory();
  }, []);

  const loadTimers = async () => {
    try {
      const savedTimers = await AsyncStorage.getItem('timers')
      if (savedTimers) {
        const parsedTimers = JSON.parse(savedTimers)
        // Add validation to ensure we don't load invalid timer data
        if (Array.isArray(parsedTimers)) {
          setTimers(parsedTimers)
        } else {
          setTimers([])
        }
      }
    } catch (error) {
      console.error('Error loading timers:', error)
      setTimers([]) // Ensure timers are cleared on error
    }
  }

  // Add save history function
  const saveHistory = async (updatedHistory: TimerHistoryItem[]) => {
    try {
      await AsyncStorage.setItem('timer_history', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };


  const addTimer = async (newTimer: Omit<Timer, 'id' | 'status' | 'remainingTime'>) => {
    const timer: Timer = {
      ...newTimer,
      id: Date.now(),
      status: 'paused',
      remainingTime: newTimer.duration,
      alerts: newTimer.alerts || [], // Add this line to initialize alerts
    }

    const updatedTimers = [...timers, timer]
    setTimers(updatedTimers)

    try {
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers))
    } catch (error) {
      console.error('Error saving timer:', error)
    }
  }

  const saveTimers = async (updatedTimers: Timer[]) => {
    try {
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers))
      setTimers(updatedTimers)
    } catch (error) {
      console.error('Error saving timers:', error)
    }
  }

  const startTimer = (id: number) => {
    const updatedTimers = timers.map(timer =>
      timer.id === id ? { ...timer, status: 'running' as const } : timer
    )
    saveTimers(updatedTimers)
  }

  const pauseTimer = (id: number) => {
    const updatedTimers = timers.map(timer =>
      timer.id === id ? { ...timer, status: 'paused' as const } : timer
    )
    saveTimers(updatedTimers)
  }

  const resetTimer = (id: number) => {
    const updatedTimers = timers.map(timer =>
      timer.id === id ? {
        ...timer,
        status: 'paused' as const,
        remainingTime: timer.duration,
        alerts: timer.alerts.map(alert => ({ ...alert, triggered: false }))
      } : timer
    )
    saveTimers(updatedTimers)
  }

  const updateTimerStatus = (id: number, status: Timer['status']) => {
    const updatedTimers = timers.map(timer =>
      timer.id === id ? { ...timer, status } : timer
    )
    saveTimers(updatedTimers)
  }

  const checkAlerts = (timer: Timer) => {
    const currentPercentage = ((timer.duration - timer.remainingTime) / timer.duration) * 100;

    // Sort alerts by percentage and find the first untriggered alert that has been reached
    const sortedAlerts = [...timer.alerts].sort((a, b) => a.percentage - b.percentage);
    const nextAlert = sortedAlerts.find(
      alert => !alert.triggered && currentPercentage >= alert.percentage
    );

    if (nextAlert) {
      // Enhanced haptic feedback
      Haptics.notificationAsync(
        nextAlert.percentage === 100
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );

      // Use ToastAndroid instead of Alert
      ToastAndroid.show(
        `${timer.name} is at ${nextAlert.percentage}% completion!`,
        ToastAndroid.SHORT
      );

      // Create updated timer with the triggered alert
      const updatedTimer = {
        ...timer,
        alerts: timer.alerts.map(alert =>
          alert.percentage === nextAlert.percentage
            ? { ...alert, triggered: true }
            : alert
        )
      };

      // Update the timer in state
      const updatedTimers = timers.map(t =>
        t.id === timer.id ? updatedTimer : t
      );
      saveTimers(updatedTimers);
    }
  };

  // Update the updateRemainingTime function to add completed timers to history
  const updateRemainingTime = (id: number, time: number) => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id) {
        const remainingTime = Math.max(0, time);
        const status = remainingTime === 0 ? 'completed' : timer.status;

        // Create updatedTimer with proper alert state preservation
        const updatedTimer = {
          ...timer,
          remainingTime,
          status,
          alerts: timer.alerts.map(alert => ({
            ...alert,
            triggered: alert.triggered || ((timer.duration - remainingTime) / timer.duration) * 100 >= alert.percentage
          }))
        };

        // Check alerts with the updated timer state
        if (updatedTimer.alerts.length > 0 && status === 'running') {
          checkAlerts(updatedTimer);
        }

        // Completion logic
        if (remainingTime === 0 && timer.status !== 'completed') {
          const historyItem: TimerHistoryItem = {
            id: Date.now(),
            name: timer.name,
            category: timer.category,
            duration: timer.duration,
            completedAt: new Date().toISOString(),
          };
          saveHistory([...history, historyItem]);
          setShowCompletionModal(true);
          setCompletedTimerName(timer.name);
        }

        return updatedTimer;
      }
      return timer;
    });
    saveTimers(updatedTimers);
  };

  // Add clear history function
  const clearHistory = async () => {
    try {
      // Clear both history and timers
      await Promise.all([
        AsyncStorage.removeItem('timer_history'),
        AsyncStorage.removeItem('timers')
      ]);

      // Reset states
      setHistory([]);
      setTimers([]);

      // Force reload timers and history
      await loadTimers();
      await loadHistory();
    } catch (error) {
      console.error('Error clearing history and timers:', error);
    }
  };

  const startCategoryTimers = (category: string) => {
    const updatedTimers = timers.map(timer =>
      timer.category === category && timer.status !== 'completed'
        ? { ...timer, status: 'running' as const }
        : timer
    );
    saveTimers(updatedTimers);
  };

  const pauseCategoryTimers = (category: string) => {
    const updatedTimers = timers.map(timer =>
      timer.category === category && timer.status === 'running'
        ? { ...timer, status: 'paused' as const }
        : timer
    );
    saveTimers(updatedTimers);
  };

  const resetCategoryTimers = (category: string) => {
    const updatedTimers = timers.map(timer =>
      timer.category === category
        ? { ...timer, status: 'paused' as const, remainingTime: timer.duration }
        : timer
    );
    saveTimers(updatedTimers);
  };

  return (
    <TimerContext.Provider value={{
      timers,
      history,
      addTimer,
      loadTimers,
      startTimer,
      pauseTimer,
      resetTimer,
      updateTimerStatus,
      updateRemainingTime,
      loadHistory,
      clearHistory,
      startCategoryTimers,
      pauseCategoryTimers,
      resetCategoryTimers,
      showCompletionModal,
      setShowCompletionModal,
      completedTimerName,
      setCompletedTimerName

    }}>
      {children}
    </TimerContext.Provider>
  )
}

export const useTimers = () => {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error('useTimers must be used within a TimerProvider')
  }
  return context
}