import type { Timer } from '@/context/TimerContext'

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
  console.log(`[updateTimersInCategory] Operation: ${operation}, Category: ${category}`);
  console.log(`[updateTimersInCategory] Timers before:`, timers.map(t => ({
    id: t.id,
    status: t.status,
    remaining: t.remainingTime
  })));

  const updatedTimers = timers.map(timer => {
    if (timer.category !== category) return timer;
    
    // Don't modify completed timers except for reset
    if (timer.status === 'completed' && operation !== 'reset') return timer;
    
    const updatedTimer = (() => {
      switch (operation) {
        case 'start':
          return {
            ...timer,
            status: 'running' as const,
            lastUpdated: Date.now()
          };
        case 'pause':
          return {
            ...timer,
            status: 'paused' as const,
            lastUpdated: Date.now()
          };
        case 'reset':
          return {
            ...timer,
            status: 'paused' as const,
            remainingTime: timer.duration,
            lastUpdated: Date.now(),
            alerts: timer.alerts.map(alert => ({ ...alert, triggered: false }))
          };
        default:
          return timer;
      }
    })();

    console.log(`[updateTimersInCategory] Timer ${timer.id} updated:`, {
      before: timer.status,
      after: updatedTimer.status
    });

    return updatedTimer;
  });

  console.log(`[updateTimersInCategory] Timers after:`, updatedTimers.map(t => ({
    id: t.id,
    status: t.status,
    remaining: t.remainingTime
  })));

  return updatedTimers;
}

export const getTimerUpdateInterval = (timer: Timer, now: number): number => {
  if (!timer.lastUpdated) return 1;
  const elapsed = Math.floor((now - timer.lastUpdated) / 1000);
  return Math.max(1, elapsed);
}

export const calculateTimerProgress = (timer: Timer) => {
  if (timer.duration === 0) return 0;
  return Math.min(100, ((timer.duration - timer.remainingTime) / timer.duration) * 100);
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