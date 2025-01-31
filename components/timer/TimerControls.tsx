import { useTheme } from '@/context/ThemeContext'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface TimerControlsProps {
    status: 'completed' | 'running' | 'paused'
    onPlayPause: () => void
    onReset: () => void
    remainingTime: number
}

export const TimerControls = ({
  status,
  onPlayPause,
  onReset,
  remainingTime
}: TimerControlsProps) => {
  const { isDark } = useTheme()

  const handlePlayPause = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      onPlayPause()
  }

  const handleReset = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      onReset()
  }

  return (
    <View className="flex-row items-center gap-4">
      <TouchableOpacity
        className={`w-14 h-14 rounded-2xl items-center justify-center ${
          status === 'running'
            ? isDark ? 'bg-status-error-dark/20 border-2 border-status-error-dark/30'
              : 'bg-status-error-light/10 border-2 border-status-error-light/20'
            : isDark ? 'bg-status-success-dark/20 border-2 border-status-success-dark/30'
              : 'bg-status-success-light/10 border-2 border-status-success-light/20'
        }`}
        activeOpacity={0.7}
        onPress={handlePlayPause}
        disabled={status === 'completed'}
      >
        <Feather
          name={status === 'running' ? 'pause' : 'play'}
          size={26}
          color={status === 'running'
            ? isDark ? '#f87171' : '#ef4444'
            : isDark ? '#6ee7b7' : '#059669'
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-14 h-14 rounded-2xl items-center justify-center ${
          isDark
            ? 'bg-slate-800/50 border-2 border-slate-700'
            : 'bg-slate-50 border-2 border-slate-200'
        }`}
        activeOpacity={0.7}
        onPress={handleReset}
        disabled={status === 'completed' && remainingTime === 0}
      >
        <Feather
          name="refresh-ccw"
          size={26}
          color={isDark ? '#94a3b8' : '#64748b'}
        />
      </TouchableOpacity>
    </View>
  )
}