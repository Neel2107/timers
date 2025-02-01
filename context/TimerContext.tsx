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

  const resetTimer = async (id: number) => {
    const updatedTimers = timers.map(timer =>
      timer.id === id ? {
        ...timer,
        status: 'paused' as const,
        remainingTime: timer.duration,
        alerts: timer.alerts.map(alert => ({ ...alert, triggered: false }))
      } : timer
    )
    setTimers(updatedTimers)
    await saveTimers(updatedTimers)
  }

  const updateTimerStatus = (id: number, status: Timer['status']) => {
    const updatedTimers = timers.map(timer =>
      timer.id === id ? { ...timer, status } : timer
    )
    saveTimers(updatedTimers)
  }

  const checkAlerts = async (timer: Timer) => {
    if (!timer.alerts || timer.status !== 'running') {
      console.log('Alert check skipped:', {
        reason: !timer.alerts ? 'No alerts' : 'Timer not running',
        timerStatus: timer.status,
        alertsCount: timer.alerts?.length
      });
      return;
    }

    const currentPercentage = ((timer.duration - timer.remainingTime) / timer.duration) * 100;

    // Get the current timer with latest state
    const currentTimer = timers.find(t => t.id === timer.id);
    if (!currentTimer) return;

    // Find the next untriggered alert that should be triggered
    const nextAlert = currentTimer.alerts
      .filter(alert => !alert.triggered && currentPercentage >= alert.percentage)
      .sort((a, b) => a.percentage - b.percentage)[0];

    console.log('Alert Status:', {
      currentPercentage: currentPercentage.toFixed(2) + '%',
      nextAlert: nextAlert?.percentage,
      allAlerts: currentTimer.alerts.map(a => ({
        percentage: a.percentage,
        triggered: a.triggered
      }))
    });

    if (nextAlert) {
      console.log('Triggering Alert:', {
        percentage: nextAlert.percentage,
        timerName: timer.name
      });

      // Trigger haptic feedback
      await Haptics.notificationAsync(
        nextAlert.percentage === 100
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );

      // Show toast notification
      ToastAndroid.show(
        `${timer.name} is ${nextAlert.percentage}% complete!`,
        ToastAndroid.SHORT
      );

      // Update the alerts state
      const updatedTimers = timers.map(t => {
        if (t.id === timer.id) {
          return {
            ...t,
            alerts: t.alerts.map(alert => ({
              ...alert,
              triggered: alert.triggered || alert.percentage === nextAlert.percentage
            }))
          };
        }
        return t;
      });

      // Update state synchronously
      setTimers(updatedTimers);
      await saveTimers(updatedTimers);
    }
  };

  const updateRemainingTime = async (id: number, time: number) => {
    // Update a single timer without affecting others
    const timer = timers.find(t => t.id === id);
    if (!timer) return;

    const remainingTime = Math.max(0, time);
    const status = remainingTime === 0 ? 'completed' : timer.status;

    // Update timer state first
    const updatedTimers = timers.map(t => {
      if (t.id === id) {
        const updatedTimer = {
          ...t,
          remainingTime,
          status
        };

        // Handle timer completion
        if (remainingTime === 0 && t.status !== 'completed') {
          const historyItem: TimerHistoryItem = {
            id: Date.now(),
            name: t.name,
            category: t.category,
            duration: t.duration,
            completedAt: new Date().toISOString(),
          };
          saveHistory([...history, historyItem]);
          setShowCompletionModal(true);
          setCompletedTimerName(t.name);
        }

        return updatedTimer;
      }
      return t;
    });

    // Update state synchronously
    setTimers(updatedTimers);
    await saveTimers(updatedTimers);

    // Check alerts after state is updated
    if (status === 'running') {
      await checkAlerts(timer);
    }
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
    setTimers(updatedTimers);
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
        ? {
          ...timer,
          status: 'paused' as const,
          remainingTime: timer.duration,
          alerts: timer.alerts.map(alert => ({ ...alert, triggered: false }))
        }
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