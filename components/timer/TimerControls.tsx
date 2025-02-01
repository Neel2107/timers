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

export const TimerControls = ({ status, onPlayPause, onReset, remainingTime }: TimerControlsProps) => {
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
    <View className="flex-row items-center gap-2">
      <TouchableOpacity
        className={`w-10 h-10 rounded-xl items-center justify-center border ${
          status === 'running'
            ? isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
            : isDark 
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
        }`}
        activeOpacity={0.7}
        onPress={handlePlayPause}
        disabled={status === 'completed'}
      >
        <Feather
          name={status === 'running' ? 'pause' : 'play'}
          size={18}
          color={status === 'running'
            ? isDark ? '#818cf8' : '#6366f1'
            : isDark ? '#818cf8' : '#6366f1'
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        className={`w-10 h-10 rounded-xl items-center justify-center border ${
          isDark
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}
        activeOpacity={0.7}
        onPress={handleReset}
        disabled={status === 'completed' && remainingTime === 0}
      >
        <Feather
          name="refresh-ccw"
          size={18}
          color={isDark ? '#94a3b8' : '#64748b'}
        />
      </TouchableOpacity>
    </View>
  )
}