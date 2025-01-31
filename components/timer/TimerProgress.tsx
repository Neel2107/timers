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
    <View className="mt-7">
      <View className="flex-row justify-between items-center mb-4">
        <Text className={`text-lg font-medium ${
          status === 'completed'
            ? isDark ? 'text-emerald-400' : 'text-emerald-600'
            : isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {status === 'completed' ? 'Completed' : `${progressPercentage}% Complete`}
        </Text>
        <Text className={`text-lg font-semibold ${
          status === 'running'
            ? isDark ? 'text-violet-300' : 'text-violet-600'
            : isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {format(remainingTime * 1000, 'mm:ss')}
        </Text>
      </View>

      <View className={`h-4 rounded-full overflow-hidden ${
        isDark ? 'bg-slate-700/50' : 'bg-slate-100'
      }`}>
        <Animated.View
          className="h-full rounded-full"
          style={progressStyle}
        />
      </View>
    </View>
  )
}