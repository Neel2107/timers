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
import { createHistoryItem, shouldShowCompletionModal, updateTimerWithRemaining } from '@/utils/timerStateUpdates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

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


  const updateRemainingTime = async (id: number, time: number) => {
    const timer = timers.find(t => t.id === id)
    if (!timer) return

    const updatedTimer = updateTimerWithRemaining(timer, time)
    const updatedTimers = timers.map(t => (t.id === id ? updatedTimer : t))

    if (shouldShowCompletionModal(timer, time)) {
      const historyItem = createHistoryItem(timer)
      await saveHistory([...history, historyItem])
      setShowCompletionModal(true)
      setCompletedTimerName(timer.name)
    }

    setTimers(updatedTimers)
    await saveTimers(updatedTimers)

    if (updatedTimer.status === 'running') {
      await checkAlerts(timer)
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

  const startCategoryTimers = (category: string) => {
    const updatedTimers = updateTimersInCategory(timers, category, 'start')
    setTimers(updatedTimers)
    saveTimers(updatedTimers)
  }

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