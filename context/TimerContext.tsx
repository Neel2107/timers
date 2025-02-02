import AlertModal from '@/components/modals/AlertModal';
import { handleTimerAlert, logAlertStatus } from '@/utils/alertHandlers';
import {
  clearAllData,
  loadHistory as loadHistoryFromStorage,
  loadTimers as loadTimersFromStorage,
  saveHistory as saveHistoryToStorage,
  saveTimers as saveTimersToStorage
} from '@/utils/storage';
import {
  createHistoryItem,
  getNextAlert,
  updateTimerAlerts,
  updateTimersInCategory
} from '@/utils/timerOperations';
import * as Haptics from 'expo-haptics';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

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
  showAlertModal: boolean;
  setShowAlertModal: (show: boolean) => void;
  alertTimer: Timer | null;
  setAlertTimer: (timer: Timer | null) => void;
  alertPercentage: number;
  setAlertPercentage: (percentage: number) => void;
  
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [history, setHistory] = useState<TimerHistoryItem[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedTimerName, setCompletedTimerName] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTimer, setAlertTimer] = useState<Timer | null>(null);
  const [alertPercentage, setAlertPercentage] = useState(0);
  
  const intervalsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const lastTickRef = useRef<{ [key: number]: number }>({});
  const frameRef = useRef<{ [key: number]: number }>({});

  /**
   * Saves timer history to AsyncStorage and updates local state
   * Used when a timer completes to maintain completion records
   */
  const saveHistory = async (updatedHistory: TimerHistoryItem[]) => {
    try {
      await saveHistoryToStorage(updatedHistory);
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  /**
   * Creates a new timer with default values and saves it
   * Handles the creation of timers from user input with initial paused state
   */
  const addTimer = async (newTimer: Omit<Timer, 'id' | 'status' | 'remainingTime'>) => {
    const timer: Timer = {
      ...newTimer,
      id: Date.now(),
      status: 'paused',
      remainingTime: newTimer.duration,
      alerts: newTimer.alerts || [],
    }

    const updatedTimers = [...timers, timer];
    try {
      await saveTimersToStorage(updatedTimers);
      setTimers(updatedTimers);
    } catch (error) {
      console.error('Error saving timer:', error);
    }
  };

  /**
   * Persists timer state to AsyncStorage and updates local state
   * Central function for saving timer state changes
   */
  const saveTimers = async (updatedTimers: Timer[]) => {
    try {
      await saveTimersToStorage(updatedTimers);
      setTimers(updatedTimers);
    } catch (error) {
      console.error('Error saving timers:', error);
    }
  };


   /**
   * Checks and handles timer alerts
   * Manages percentage-based alerts and triggers notifications
   * Used during timer execution to show progress alerts
   */
   const checkAlerts = async (timer: Timer) => {
    if (!timer.alerts || timer.status !== 'running') return

    const currentPercentage = ((timer.duration - timer.remainingTime) / timer.duration) * 100;
    const currentTimer = timers.find(t => t.id === timer.id);
    if (!currentTimer) return;

     const nextAlert = getNextAlert(currentTimer);
    logAlertStatus(currentPercentage, nextAlert, currentTimer.alerts);

    if (nextAlert) {
      await Haptics.notificationAsync(
        nextAlert.percentage === 100
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );
      
      setAlertTimer(timer);
      setAlertPercentage(nextAlert.percentage);
      setShowAlertModal(true);

      const updatedTimers = timers.map(t =>
        t.id === timer.id
          ? { ...t, alerts: updateTimerAlerts(t, currentPercentage) }
          : t
      );
      setTimers(updatedTimers);
      await saveTimers(updatedTimers);
    }
  }

  
  /**
   * Updates the remaining time for a running timer
   * Handles time calculations, completion checks, and cleanup
   * Uses requestAnimationFrame for smooth updates
   */
  const updateRemainingTime = useCallback((id: number) => {
    const now = Date.now();
    const lastTick = lastTickRef.current[id] || now;
    const elapsed = Math.floor((now - lastTick) / 1000);
  
    if (elapsed === 0) return;
    lastTickRef.current[id] = now;
  
    const currentTimer = timers.find(t => t.id === id);
    if (!currentTimer || currentTimer.status !== 'running') return;
  
    const newRemainingTime = Math.max(0, currentTimer.remainingTime - elapsed);
  
    // Handle completion
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
  
      const historyItem = createHistoryItem(currentTimer);
      saveHistory([...history, historyItem]);
      setShowCompletionModal(true);
      setCompletedTimerName(currentTimer.name);
  
      setTimers(prev => 
        prev.map(t => t.id === id ? { ...t, remainingTime: 0, status: 'completed' } : t)
      );
      return;
    }
  
    // Update timer state
    setTimers(prev => 
      prev.map(t => t.id === id ? { ...t, remainingTime: newRemainingTime } : t)
    );
  
    // Schedule next check for alerts separately
    if (currentTimer.alerts?.length > 0) {
      requestAnimationFrame(() => {
        checkAlerts(currentTimer);
      });
    }
  
    // Continue animation frame if timer is still running
    if (intervalsRef.current[id]) {
      frameRef.current[id] = requestAnimationFrame(() => {
        if (intervalsRef.current[id]) {
          updateRemainingTime(id);
        }
      });
    }
  }, [history, checkAlerts, timers]);

  /**
   * Starts a specific timer by ID
   * Sets up interval for time tracking and updates timer status
   * Used for individual timer start actions
   */
  const startTimer = useCallback((id: number) => {
    setTimers(prevTimers => {
      const now = Date.now();
      return prevTimers.map(timer => {
        if (timer.id === id && timer.status !== 'completed') {
          lastTickRef.current[id] = now;
          intervalsRef.current[id] = setInterval(() => {
            updateRemainingTime(id);
          }, 1000);
          return { ...timer, status: 'running' as const, lastUpdated: now };
        }
        return timer;
      });
    });
  }, [updateRemainingTime]);

  /**
   * Starts all timers in a specific category
   * Used for bulk operations on category level
   * Sets up intervals for each timer in the category
   */
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

  /**
   * Pauses a specific timer by ID
   * Cleans up intervals and updates timer status
   * Used for individual timer pause actions
   */
  const pauseTimer = useCallback((id: number) => {
    if (intervalsRef.current[id]) {
      clearInterval(intervalsRef.current[id]);
      delete intervalsRef.current[id];
    }

    setTimers(prevTimers =>
      prevTimers.map(timer =>
        timer.id === id ? { ...timer, status: 'paused' as const, lastUpdated: Date.now() } : timer
      )
    );
  }, []);

  /**
   * Resets a timer to its initial state
   * Restores original duration and clears alert triggers
   * Used for individual timer reset actions
   */
  const resetTimer = async (id: number) => {
    const updatedTimers = timers.map(timer =>
      timer.id === id ? {
        ...timer,
        status: 'paused' as const,
        remainingTime: timer.duration,
        alerts: timer.alerts.map(alert => ({ ...alert, triggered: false }))
      } : timer
    );
    setTimers(updatedTimers);
    await saveTimers(updatedTimers);
  };

  /**
   * Updates the status of a specific timer
   * Used for direct status changes without additional logic
   */
  const updateTimerStatus = (id: number, status: Timer['status']) => {
    const updatedTimers = timers.map(timer =>
      timer.id === id ? { ...timer, status } : timer
    )
    saveTimers(updatedTimers)
  }

 
  /**
   * Clears all timer and history data
   * Used for resetting the app to initial state
   * Removes data from AsyncStorage and resets state
   */
  const clearHistory = async () => {
    try {
      await clearAllData();

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

  /**
   * Pauses all timers in a specific category
   * Used for bulk pause operations at category level
   * Cleans up intervals for all category timers
   */
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

  /**
   * Resets all timers in a specific category
   * Used for bulk reset operations at category level
   */
  const resetCategoryTimers = (category: string) => {
    const updatedTimers = updateTimersInCategory(timers, category, 'reset')
    setTimers(updatedTimers)
    saveTimers(updatedTimers)
  }

  /**
   * Loads timer history from AsyncStorage
   * Used during app initialization and after data changes
   */
  const loadHistory = async () => {
    const loadedHistory = await loadHistoryFromStorage()
    setHistory(loadedHistory)
  }

  /**
   * Loads and restores timer states from AsyncStorage
   * Handles timer state restoration after app restart
   * Restarts running timers and their intervals
   */
  const loadTimers = async () => {
    try {
      const storedTimers = await loadTimersFromStorage();
      if (storedTimers && storedTimers.length > 0) {
        setTimers(storedTimers);

        // Restart intervals for running timers
        const now = Date.now();
        storedTimers.forEach(timer => {
          if (timer.status === 'running') {
            lastTickRef.current[timer.id] = now;
            intervalsRef.current[timer.id] = setInterval(() => {
              updateRemainingTime(timer.id);
            }, 1000);
          }
        });
      }
    } catch (error) {
      console.error('Error loading timers:', error);
    }
  };

  // Effect hooks for initialization, cleanup, and state management
  useEffect(() => {
    // Initial load effect
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
    if (timers.length > 0) {
      saveTimers(timers);
    }
  }, [timers]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        loadTimers();
      } else if (nextAppState === 'background') {
        // Save current state before going to background
        saveTimers(timers);
      }
    });

    return () => {
      subscription.remove();
    };
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
      setCompletedTimerName,
      showAlertModal,
      setShowAlertModal,
      alertTimer,
      setAlertTimer,
      alertPercentage,
      setAlertPercentage,
    }}>
      {children}
      {showAlertModal && alertTimer && (
        <AlertModal
          isVisible={showAlertModal}
          timer={alertTimer}
          percentage={alertPercentage}
          onClose={() => setShowAlertModal(false)}
        />
      )}
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