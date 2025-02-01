import { useTheme } from '@/context/ThemeContext'
import { format } from 'date-fns'
import React from 'react'
import { Text, View } from 'react-native'
import Animated from 'react-native-reanimated'

interface TimerProgressProps {
  status: 'completed' | 'running' | 'paused'
  progressPercentage: number
  remainingTime: number
  progressStyle: any
}

export const TimerProgress = ({
  status,
  progressPercentage,
  remainingTime,
  progressStyle
}: TimerProgressProps) => {
  const { isDark } = useTheme()

  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className={`text-sm font-medium ${
          status === 'completed'
            ? isDark ? 'text-slate-300' : 'text-slate-700'
            : isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {status === 'completed' ? 'Completed' : `${progressPercentage}% Complete`}
        </Text>
        <Text className={`text-sm font-medium ${
          status === 'running'
            ? isDark ? 'text-slate-300' : 'text-slate-700'
            : isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {format(remainingTime * 1000, 'mm:ss')}
        </Text>
      </View>

      <View className={`h-2 rounded-full overflow-hidden ${
        isDark ? 'bg-slate-700' : 'bg-slate-100'
      }`}>
        <Animated.View
          className="h-full rounded-full"
          style={progressStyle}
        />
      </View>
    </View>
  )
}