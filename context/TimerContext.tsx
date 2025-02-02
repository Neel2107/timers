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
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

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
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedTimerName, setCompletedTimerName] = useState('');
  const [activeIntervals, setActiveIntervals] = useState<{ [key: number]: NodeJS.Timeout }>({});

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
    setTimers((currentTimers: any) => {
      const timer = currentTimers.find((t: any) => t.id === id);
      if (!timer || timer.status !== 'running') return currentTimers;

      const newRemainingTime = Math.max(0, timer.remainingTime - 1);
      const updatedTimer = {
        ...timer,
        remainingTime: newRemainingTime,
        status: newRemainingTime === 0 ? 'completed' : 'running'
      };

      if (newRemainingTime === 0) {
        const historyItem = createHistoryItem(timer);
        saveHistory([...history, historyItem]);
        setShowCompletionModal(true);
        setCompletedTimerName(timer.name);

        if (activeIntervals[id]) {
          clearInterval(activeIntervals[id]);
          setActiveIntervals(prev => {
            const newIntervals = { ...prev };
            delete newIntervals[id];
            return newIntervals;
          });
        }
      }

      const updatedTimers = currentTimers.map((t: any) =>
        t.id === id ? updatedTimer : t
      );
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  }, [history, activeIntervals]);

  const startTimer = useCallback((id: number) => {
    const timer = timers.find(t => t.id === id);
    if (!timer || timer.status === 'completed') return;

    setTimers(currentTimers =>
      currentTimers.map(t =>
        t.id === id ? { ...t, status: 'running' } : t
      )
    );

    if (!activeIntervals[id]) {
      const interval = setInterval(() => updateRemainingTime(id), 1000);
      setActiveIntervals(prev => ({
        ...prev,
        [id]: interval
      }));
    }
  }, [timers, activeIntervals, updateRemainingTime]);

  const startCategoryTimers = useCallback((category: string) => {
    const categoryTimers = timers.filter(t =>
      t.category === category && t.status !== 'completed'
    );

    setTimers(currentTimers =>
      currentTimers.map(timer =>
        timer.category === category && timer.status !== 'completed'
          ? { ...timer, status: 'running' }
          : timer
      )
    );

    categoryTimers.forEach(timer => {
      if (!activeIntervals[timer.id]) {
        const interval = setInterval(() => updateRemainingTime(timer.id), 1000);
        setActiveIntervals(prev => ({
          ...prev,
          [timer.id]: interval
        }));
      }
    });
  }, [timers, activeIntervals, updateRemainingTime]);

  const pauseTimer = useCallback((id: number) => {
    if (activeIntervals[id]) {
      clearInterval(activeIntervals[id]);
      setActiveIntervals(prev => {
        const newIntervals = { ...prev };
        delete newIntervals[id];
        return newIntervals;
      });
    }

    const updatedTimers = timers.map(t =>
      t.id === id ? { ...t, status: 'paused' as const } : t
    );
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
  }, [timers, activeIntervals]);

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

  const pauseCategoryTimers = (category: string) => {
    const updatedTimers = updateTimersInCategory(timers, category, 'pause')
    setTimers(updatedTimers)
    saveTimers(updatedTimers)
  }

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
      Object.values(activeIntervals).forEach(interval => clearInterval(interval));
    };
  }, [activeIntervals]);

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