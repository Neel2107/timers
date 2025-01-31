import { useTheme } from '@/context/ThemeContext'
import type { Timer } from '@/context/TimerContext'
import { useTimers } from '@/context/TimerContext'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
  FadeInUp,
  FadeOutUp,
  interpolateColor,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

interface TimerCardProps {
  timer: Timer;
  index: number;
}

const TimerCard = React.memo(({ timer, index }: TimerCardProps) => {
  const { isDark } = useTheme()
  const { startTimer, pauseTimer, resetTimer, updateRemainingTime } = useTimers()
  const scale = useSharedValue(1)
  const intervalRef = useRef<NodeJS.Timeout>()

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  useEffect(() => {
    if (timer.status === 'running' && timer.remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        updateRemainingTime(timer.id, timer.remainingTime - 1)
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timer.status, timer.remainingTime, timer.id, updateRemainingTime])

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15 })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }, [])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15 })
  }, [])

  const handlePlayPause = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    if (timer.status === 'running') {
      pauseTimer(timer.id)
    } else {
      startTimer(timer.id)
    }
  }, [timer.status, timer.id, startTimer, pauseTimer])

  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    resetTimer(timer.id)
  }, [timer.id, resetTimer])

  const progressPercentage = useMemo(() =>
    Math.round((timer.remainingTime / timer.duration) * 100),
    [timer.remainingTime, timer.duration]
  )

  const progress = useDerivedValue(() => {
    return timer.remainingTime / timer.duration
  })

  const progressColor = useDerivedValue(() => {
    return interpolateColor(
      progress.value,
      [0, 0.3, 0.7, 1],
      isDark
        ? ['#f87171', '#fbbf24', '#6ee7b7', '#34d399']  // Using design system colors
        : ['#ef4444', '#f59e0b', '#34d399', '#059669']
    )
  })

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    backgroundColor: progressColor.value
  }))

  return (
    <AnimatedTouchable
      entering={FadeInUp.duration(400).delay(index * 50).springify()}
      exiting={FadeOutUp.duration(300)}
      layout={LinearTransition.springify()}
      style={[
        animatedStyle,
        {
          shadowColor: isDark ? '#000' : '#64748b',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.4 : 0.1,
          shadowRadius: 12,
          elevation: 8,
        }
      ]}
      className={`p-6 rounded-2xl border ${isDark
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
        }`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center space-x-4">
          <View className={`w-14 h-14 rounded-2xl items-center justify-center ${timer.status === 'completed'
              ? isDark ? 'bg-emerald-400/20' : 'bg-emerald-100'
              : timer.status === 'running'
                ? isDark ? 'bg-violet-500/20' : 'bg-violet-100'
                : isDark ? 'bg-slate-700' : 'bg-slate-100'
            }`}>
            <Feather
              name={
                timer.status === 'completed'
                  ? 'check-circle'
                  : timer.status === 'running'
                    ? 'activity'
                    : 'clock'
              }
              size={28}
              color={
                timer.status === 'completed'
                  ? isDark ? '#6ee7b7' : '#34d399'
                  : timer.status === 'running'
                    ? isDark ? '#a78bfa' : '#8b5cf6'
                    : isDark ? '#94a3b8' : '#64748b'
              }
            />
          </View>
          <View className="flex-1">
            <Text className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'
              }`}>
              {timer.name}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
              {timer.category}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            className={`w-12 h-12 rounded-xl items-center justify-center ${timer.status === 'running'
                ? isDark ? 'bg-red-500/20 border border-red-400/30'
                  : 'bg-red-100 border border-red-200'
                : isDark ? 'bg-emerald-400/20 border border-emerald-400/30'
                  : 'bg-emerald-100 border border-emerald-200'
              }`}
            activeOpacity={0.7}
            onPress={handlePlayPause}
            disabled={timer.status === 'completed'}
          >
            <Feather
              name={timer.status === 'running' ? 'pause' : 'play'}
              size={22}
              color={timer.status === 'running'
                ? isDark ? '#f87171' : '#ef4444'
                : isDark ? '#6ee7b7' : '#34d399'
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            className={`w-12 h-12 rounded-xl items-center justify-center ${isDark
                ? 'bg-slate-700/50 border border-slate-600'
                : 'bg-slate-100 border border-slate-200'
              }`}
            activeOpacity={0.7}
            onPress={handleReset}
            disabled={timer.status === 'completed' && timer.remainingTime === 0}
          >
            <Feather
              name="refresh-ccw"
              size={22}
              color={isDark ? '#94a3b8' : '#64748b'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className={`text-base font-medium ${timer.status === 'completed'
              ? isDark ? 'text-emerald-300' : 'text-emerald-600'
              : isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
            {timer.status === 'completed' ? 'Completed' : `${progressPercentage}% Complete`}
          </Text>
          <Text className={`text-base font-semibold ${timer.status === 'running'
              ? isDark ? 'text-violet-300' : 'text-violet-600'
              : isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
            {timer.remainingTime}s
          </Text>
        </View>

        <View className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'
          }`}>
          <Animated.View
            className="h-full rounded-full"
            style={progressStyle}
          />
        </View>
      </View>
    </AnimatedTouchable>
  )
})

export default TimerCard