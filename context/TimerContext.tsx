import { handleTimerAlert, logAlertStatus } from '@/utils/alertHandlers';
import {
  loadHistory as loadHistoryFromStorage,
  loadTimers as loadTimersFromStorage
} from '@/utils/storage';
import {
  getNextAlert,
  updateTimerAlerts,
  updateTimersInCategory
} from '@/utils/timerOperations';
import { createHistoryItem } from '@/utils/timerStateUpdates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface TimerAlert {
  percentage: number
  triggered: boolean
}
export interface Timer {
  id: number;
  name: string;
  category: string;
  duration: number;
  remainingTime: number;
  status: 'running' | 'paused' | 'completed';
  alerts: TimerAlert[];
  lastUpdated?: number;
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
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedTimerName, setCompletedTimerName] = useState('');
  const intervalsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const lastTickRef = useRef<{ [key: number]: number }>({});
  const frameRef = useRef<{ [key: number]: number }>({});

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
      alerts: newTimer.alerts || [],
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

  const updateRemainingTime = useCallback((id: number) => {
    const now = Date.now();
    const lastTick = lastTickRef.current[id] || now;
    const elapsed = Math.floor((now - lastTick) / 1000);

    if (elapsed === 0) return;
    lastTickRef.current[id] = now;

    setTimers(currentTimers => {
      const timer = currentTimers.find(t => t.id === id);
      if (!timer || timer.status !== 'running') {
        return currentTimers;
      }

      const newRemainingTime = Math.max(0, timer.remainingTime - elapsed);

      if (newRemainingTime === 0) {
        if (intervalsRef.current[id]) {
          clearInterval(intervalsRef.current[id]);
          delete intervalsRef.current[id];
        }
        if (frameRef.current[id]) {
          cancelAnimationFrame(frameRef.current[id]);
          delete frameRef.current[id];
        }
        delete lastTickRef.current[id];

        const historyItem = createHistoryItem(timer);
        saveHistory([...history, historyItem]);
        setShowCompletionModal(true);
        setCompletedTimerName(timer.name);

        return currentTimers.map(t =>
          t.id === id ? { ...t, remainingTime: 0, status: 'completed' } : t
        );
      }

      return currentTimers.map(t =>
        t.id === id ? { ...t, remainingTime: newRemainingTime } : t
      );
    });

    if (intervalsRef.current[id]) {
      frameRef.current[id] = requestAnimationFrame(() => {
        if (intervalsRef.current[id]) {
          updateRemainingTime(id);
        }
      });
    }
  }, [history]);

  const startTimer = useCallback((id: number) => {
    const timer = timers.find(t => t.id === id);
    if (!timer || timer.status === 'completed') return;

    // Set initial state
    setTimers(currentTimers =>
      currentTimers.map(t =>
        t.id === id ? { ...t, status: 'running' } : t
      )
    );

    // Start interval if not already running
    if (!intervalsRef.current[id]) {
      lastTickRef.current[id] = Date.now();
      intervalsRef.current[id] = setInterval(() => {
        updateRemainingTime(id);
      }, 1000);
    }
  }, [timers, updateRemainingTime]);

  const startCategoryTimers = useCallback((category: string) => {
    const categoryTimers = timers.filter(t =>
      t.category === category && t.status !== 'completed'
    );

    const now = Date.now();

    setTimers(currentTimers =>
      currentTimers.map(t =>
        t.category === category && t.status !== 'completed'
          ? { ...t, status: 'running', lastUpdated: now }
          : t
      )
    );

    categoryTimers.forEach(timer => {
      if (!intervalsRef.current[timer.id]) {
        lastTickRef.current[timer.id] = now;
        intervalsRef.current[timer.id] = setInterval(() => {
          if (!frameRef.current[timer.id]) {
            frameRef.current[timer.id] = requestAnimationFrame(() => {
              updateRemainingTime(timer.id);
            });
          }
        }, 1000);
      }
    });
  }, [timers, updateRemainingTime]);

  const pauseTimer = useCallback((id: number) => {
    if (intervalsRef.current[id]) {
      clearInterval(intervalsRef.current[id]);
      delete intervalsRef.current[id];
    }
    if (frameRef.current[id]) {
      cancelAnimationFrame(frameRef.current[id]);
      delete frameRef.current[id];
    }
    delete lastTickRef.current[id];

    setTimers(currentTimers =>
      currentTimers.map(t =>
        t.id === id ? { ...t, status: 'paused' } : t
      )
    );
  }, []);

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
    if (!timer.alerts || timer.status !== 'running') return

    const currentPercentage = ((timer.duration - timer.remainingTime) / timer.duration) * 100
    const currentTimer = timers.find(t => t.id === timer.id)
    if (!currentTimer) return

    const nextAlert = getNextAlert(currentTimer)
    logAlertStatus(currentPercentage, nextAlert, currentTimer.alerts)

    if (nextAlert) {
      await handleTimerAlert(timer, nextAlert)
      const updatedTimers = timers.map(t =>
        t.id === timer.id
          ? { ...t, alerts: updateTimerAlerts(t, currentPercentage) }
          : t
      )
      setTimers(updatedTimers)
      await saveTimers(updatedTimers)
    }
  }

  const clearHistory = async () => {
    try {
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

  const pauseCategoryTimers = useCallback((category: string) => {
    const categoryTimers = timers.filter(t =>
      t.category === category && t.status === 'running'
    );

    categoryTimers.forEach(timer => {
      if (intervalsRef.current[timer.id]) {
        clearInterval(intervalsRef.current[timer.id]);
        delete intervalsRef.current[timer.id];
      }
    });

    setTimers(currentTimers =>
      currentTimers.map(t =>
        t.category === category && t.status === 'running'
          ? { ...t, status: 'paused' }
          : t
      )
    );
  }, [timers]);

  const resetCategoryTimers = (category: string) => {
    const updatedTimers = updateTimersInCategory(timers, category, 'reset')
    setTimers(updatedTimers)
    saveTimers(updatedTimers)
  }

  const loadHistory = async () => {
    const loadedHistory = await loadHistoryFromStorage()
    setHistory(loadedHistory)
  }

  const loadTimers = async () => {
    const loadedTimers = await loadTimersFromStorage()
    setTimers(loadedTimers)
  }

  useEffect(() => {
    loadTimers();
    loadHistory();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(interval => clearInterval(interval));
      intervalsRef.current = {};
      lastTickRef.current = {};
    };
  }, []);

  // Save timers whenever they change
  useEffect(() => {
    saveTimers(timers);
  }, [timers]);

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