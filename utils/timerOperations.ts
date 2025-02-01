import type { Timer, TimerAlert } from '@/context/TimerContext'

export const updateTimerAlerts = (timer: Timer, currentPercentage: number) => {
  return timer.alerts.map(alert => ({
    ...alert,
    triggered: alert.triggered || currentPercentage >= alert.percentage
  }))
}

export const getNextAlert = (timer: Timer) => {
  const currentPercentage = ((timer.duration - timer.remainingTime) / timer.duration) * 100
  return timer.alerts
    .filter(alert => !alert.triggered && currentPercentage >= alert.percentage)
    .sort((a, b) => a.percentage - b.percentage)[0]
}

export const updateTimersInCategory = (
  timers: Timer[],
  category: string,
  operation: 'start' | 'pause' | 'reset'
): Timer[] => {
  return timers.map(timer => {
    if (timer.category !== category) return timer
    
    switch (operation) {
      case 'start':
        return timer.status !== 'completed'
          ? { ...timer, status: 'running' as const }
          : timer
      case 'pause':
        return timer.status === 'running'
          ? { ...timer, status: 'paused' as const }
          : timer
      case 'reset':
        return {
          ...timer,
          status: 'paused' as const,
          remainingTime: timer.duration,
          alerts: timer.alerts.map(alert => ({ ...alert, triggered: false }))
        }
    }
  })
}

export const calculateTimerProgress = (timer: Timer) => {
  return ((timer.duration - timer.remainingTime) / timer.duration) * 100
}

export const isTimerEligibleForAction = (
  timer: Timer,
  action: 'start' | 'pause' | 'reset'
): boolean => {
  switch (action) {
    case 'start':
      return timer.status !== 'completed' && timer.remainingTime > 0
    case 'pause':
      return timer.status === 'running'
    case 'reset':
      return true
    default:
      return false
  }
}