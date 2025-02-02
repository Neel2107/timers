import type { Timer, TimerHistoryItem } from '@/context/TimerContext'

export const createHistoryItem = (timer: Timer): TimerHistoryItem => ({
  id: Date.now(),
  name: timer.name,
  category: timer.category,
  duration: timer.duration,
  completedAt: new Date().toISOString(),
})

export const updateTimerWithRemaining = (
  timer: Timer,
  remainingTime: number
): Timer => ({
  ...timer,
  remainingTime: Math.max(0, remainingTime),
  status: remainingTime <= 0 ? 'completed' : timer.status,
  lastUpdated: Date.now()
})

export const shouldShowCompletionModal = (
  timer: Timer,
  remainingTime: number
): boolean => {
  return remainingTime === 0 && timer.status !== 'completed'
}