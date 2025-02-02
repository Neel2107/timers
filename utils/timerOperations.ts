import type { Timer } from '@/context/TimerContext'
import type { TimerHistoryItem } from '@/context/TimerContext';

// Add at the beginning of the file
export const createHistoryItem = (timer: Timer): TimerHistoryItem => ({
  id: Date.now(),
  name: timer.name,
  category: timer.category,
  duration: timer.duration,
  completedAt: new Date().toISOString(),
});

export const updateTimerAlerts = (timer: Timer, currentPercentage: number) => {
  return timer.alerts.map(alert => ({
    ...alert,
    triggered: alert.triggered || currentPercentage >= alert.percentage
  }));
};

export const getNextAlert = (timer: Timer) => {
  const currentPercentage = ((timer.duration - timer.remainingTime) / timer.duration) * 100;
  return timer.alerts
    .filter(alert => !alert.triggered && currentPercentage >= alert.percentage)
    .sort((a, b) => a.percentage - b.percentage)[0];
};

export const updateTimersInCategory = (
  timers: Timer[],
  category: string,
  operation: 'start' | 'pause' | 'reset'
): Timer[] => {
  return timers.map(timer => {
    if (timer.category !== category) return timer;
    if (timer.status === 'completed' && operation !== 'reset') return timer;

    switch (operation) {
      case 'start':
        return { ...timer, status: 'running', lastUpdated: Date.now() };
      case 'pause':
        return { ...timer, status: 'paused', lastUpdated: Date.now() };
      case 'reset':
        return {
          ...timer,
          status: 'paused',
          remainingTime: timer.duration,
          lastUpdated: Date.now(),
          alerts: timer.alerts.map(alert => ({ ...alert, triggered: false }))
        };
      default:
        return timer;
    }
  });
};

export const isTimerEligibleForAction = (
  timer: Timer,
  action: 'start' | 'pause' | 'reset'
): boolean => {
  switch (action) {
    case 'start':
      return timer.status !== 'completed' && timer.remainingTime > 0;
    case 'pause':
      return timer.status === 'running';
    case 'reset':
      return true;
    default:
      return false;
  }
};

export const shouldShowCompletionModal = (
  timer: Timer,
  remainingTime: number
): boolean => {
  return remainingTime === 0 && timer.status !== 'completed';
};