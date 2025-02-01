import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Timer, TimerHistoryItem } from '@/context/TimerContext'

export const saveTimers = async (timers: Timer[]): Promise<void> => {
  try {
    await AsyncStorage.setItem('timers', JSON.stringify(timers))
  } catch (error) {
    console.error('Error saving timers:', error)
  }
}

export const loadTimers = async (): Promise<Timer[]> => {
  try {
    const savedTimers = await AsyncStorage.getItem('timers')
    if (savedTimers) {
      const parsedTimers = JSON.parse(savedTimers)
      return Array.isArray(parsedTimers) ? parsedTimers : []
    }
    return []
  } catch (error) {
    console.error('Error loading timers:', error)
    return []
  }
}

export const saveHistory = async (history: TimerHistoryItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem('timer_history', JSON.stringify(history))
  } catch (error) {
    console.error('Error saving history:', error)
  }
}

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
      AsyncStorage.removeItem('timer_history'),
      AsyncStorage.removeItem('timers')
    ])
  } catch (error) {
    console.error('Error clearing data:', error)
  }
}