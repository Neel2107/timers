import { useTheme } from '@/context/ThemeContext'
import { Feather } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'

interface TimerStatusIconProps {
  status: 'completed' | 'running' | 'paused'
}

export const TimerStatusIcon = ({ status }: TimerStatusIconProps) => {
  const { isDark } = useTheme()

  return (
    <View className={`w-16 h-16 rounded-2xl items-center justify-center ${
      status === 'completed'
        ? isDark ? 'bg-emerald-500/15' : 'bg-emerald-50'
        : status === 'running'
          ? isDark ? 'bg-violet-500/15' : 'bg-violet-50'
          : isDark ? 'bg-slate-700/50' : 'bg-slate-100'
    }`}>
      <Feather
        name={
          status === 'completed'
            ? 'check-circle'
            : status === 'running'
              ? 'activity'
              : 'clock'
        }
        size={32}
        color={
          status === 'completed'
            ? isDark ? '#6ee7b7' : '#059669'
            : status === 'running'
              ? isDark ? '#a78bfa' : '#7c3aed'
              : isDark ? '#94a3b8' : '#64748b'
        }
      />
    </View>
  )
}