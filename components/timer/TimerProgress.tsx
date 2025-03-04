import { useTheme } from '@/context/ThemeContext'
import { formatTime } from '@/utils/helpers'
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
    <View className=" gap-5">
      <View className="flex-row justify-between items-center ">
        <Text className={`text-sm font-medium ${status === 'completed'
            ? isDark ? 'text-indigo-400' : 'text-indigo-600'
            : isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
          {status === 'completed' ? 'Completed' : `${progressPercentage}% Complete`}
        </Text>
        {remainingTime > 0 && <Text className={`text-sm font-medium ${status === 'running'
            ? isDark ? 'text-indigo-400' : 'text-indigo-600'
            : isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
          {formatTime(remainingTime)}
        </Text>}
      </View>

      <View className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'
        }`}>
        <Animated.View
          className="h-full rounded-full"
          style={progressStyle}
        />
      </View>
    </View>
  )
}