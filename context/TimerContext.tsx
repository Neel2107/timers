import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Timer {
  id: number;
  name: string;
  duration: number;
  category: string;
  status: 'running' | 'paused' | 'completed';
  remainingTime: number;
}

interface TimerContextType {
  timers: Timer[]
  addTimer: (timer: Omit<Timer, 'id' | 'status' | 'remainingTime'>) => void
  loadTimers: () => Promise<void>
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [timers, setTimers] = useState<Timer[]>([]);

  useEffect(() => {
    loadTimers();
  }, []);

  const loadTimers = async () => {
    try {
      const savedTimers = await AsyncStorage.getItem('timers')
      if (savedTimers) {
        setTimers(JSON.parse(savedTimers))
      }
    } catch (error) {
      console.error('Error loading timers:', error)
    }
  }

  const addTimer = async (newTimer: Omit<Timer, 'id' | 'status' | 'remainingTime'>) => {
    const timer: Timer = {
      ...newTimer,
      id: Date.now(),
      status: 'paused',
      remainingTime: newTimer.duration,
    }

    const updatedTimers = [...timers, timer]
    setTimers(updatedTimers)

    try {
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers))
    } catch (error) {
      console.error('Error saving timer:', error)
    }
  }

  return (
    <TimerContext.Provider value={{ timers, addTimer, loadTimers }}>
      {children}
    </TimerContext.Provider>
  )
}

export const useTimers = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimers must be used within a TimerProvider');
  }
  return context;
};