import { STORAGE_KEYS } from '@/constants/constants';
import type { Timer, TimerHistoryItem } from '@/context/TimerContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTimers = async (timers: Timer[]): Promise<void> => {
  try {
    const timersToSave = timers.map(timer => ({
      ...timer,
      lastUpdated: timer.status === 'running' ? Date.now() : timer.lastUpdated
    }));
    await AsyncStorage.setItem(STORAGE_KEYS.TIMERS, JSON.stringify(timersToSave));
  } catch (error) {
    console.error('Error saving timers:', error);
    throw error; // Propagate error to caller
  }
};



export const loadTimers = async (): Promise<Timer[]> => {
  try {
    const savedTimers = await AsyncStorage.getItem('timers');
    if (savedTimers) {
      const parsedTimers = JSON.parse(savedTimers);
      const now = Date.now();
      
      // Process timers to account for elapsed time
      const processedTimers = parsedTimers.map((timer: Timer) => {
        if (timer.status === 'running' && timer.lastUpdated) {
          const elapsedSeconds = Math.floor((now - timer.lastUpdated) / 1000);
          const newRemainingTime = Math.max(0, timer.remainingTime - elapsedSeconds);
          
          return {
            ...timer,
            remainingTime: newRemainingTime,
            status: newRemainingTime === 0 ? 'completed' : 'running',
            lastUpdated: now
          };
        }
        return timer;
      });
      
      return Array.isArray(processedTimers) ? processedTimers : [];
    }
    return [];
  } catch (error) {
    console.error('Error loading timers:', error);
    return [];
  }
};

export const saveHistory = async (history: TimerHistoryItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history:', error);
    throw error; // Propagate error to caller
  }
};

export const loadHistory = async (): Promise<TimerHistoryItem[]> => {
  try {
    const savedHistory = await AsyncStorage.getItem('timer_history')
    return savedHistory ? JSON.parse(savedHistory) : []
  } catch (error) {
    console.error('Error loading history:', error)
    return []
  }
}



export const clearAllData = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.HISTORY),
      AsyncStorage.removeItem(STORAGE_KEYS.TIMERS)
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error; // Propagate error to caller
  }
};