import * as Haptics from 'expo-haptics'
import { ToastAndroid } from 'react-native'
import type { Timer } from '@/context/TimerContext'

export const handleTimerAlert = async (
  timer: Timer,
  nextAlert: { percentage: number; triggered: boolean }
) => {
  // Trigger haptic feedback
  await Haptics.notificationAsync(
    nextAlert.percentage === 100
      ? Haptics.NotificationFeedbackType.Success
      : Haptics.NotificationFeedbackType.Warning
  )

  // Show toast notification
  ToastAndroid.show(
    `${timer.name} is ${nextAlert.percentage}% complete!`,
    ToastAndroid.SHORT
  )
}

export const logAlertStatus = (
  currentPercentage: number,
  nextAlert?: { percentage: number },
  alerts?: { percentage: number; triggered: boolean }[]
) => {
  console.log('Alert Status:', {
    currentPercentage: currentPercentage.toFixed(2) + '%',
    nextAlert: nextAlert?.percentage,
    allAlerts: alerts?.map(a => ({
      percentage: a.percentage,
      triggered: a.triggered
    }))
  })
}