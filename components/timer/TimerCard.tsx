import { useTheme } from '@/context/ThemeContext'
import type { Timer } from '@/context/TimerContext'
import { useTimers } from '@/context/TimerContext'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React, { useCallback, useEffect, useRef } from 'react'
import { Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
  FadeInUp,
  FadeOutUp,
  interpolateColor,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated'
import { TimerProgress } from './TimerProgress'

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
  const lastTickRef = useRef<number>(Date.now())

  useEffect(() => {
    if (timer.status === 'running' && timer.remainingTime > 0) {
      lastTickRef.current = Date.now()

      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const drift = now - lastTickRef.current
        const tickCount = Math.floor(drift / 1000)

        if (tickCount >= 1) {
          const newRemainingTime = Math.max(0, timer.remainingTime - tickCount)
          updateRemainingTime(timer.id, newRemainingTime)
          lastTickRef.current = now - (drift % 1000)
        }
      }, 100)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }
  }, [timer.status, timer.id, updateRemainingTime])


  const handlePlayPause = useCallback(() => {
    if (timer.status === 'running') {
      pauseTimer(timer.id)
    } else {
      startTimer(timer.id)
    }
  }, [timer.status, timer.id, startTimer, pauseTimer])

  const handleReset = useCallback(() => {
    resetTimer(timer.id)
  }, [timer.id, resetTimer])

  const progressPercentage = useDerivedValue(() =>
    Math.round((timer.remainingTime / timer.duration) * 100)
  )

  const progress = useDerivedValue(() => {
    return timer.remainingTime / timer.duration
  })

  const progressColor = useDerivedValue(() => {
    if (timer.status === 'completed') {
      return isDark ? '#818cf8' : '#6366f1'
    }
    return interpolateColor(
      progress.value,
      [0, 0.3, 0.7, 1],
      isDark
        ? ['#ef4444', '#f97316', '#84cc16', '#818cf8']
        : ['#dc2626', '#ea580c', '#65a30d', '#6366f1']
    )
  })

  const progressStyle = useAnimatedStyle(() => ({
    width: `${(1 - progress.value) * 100}%`,
    backgroundColor: progressColor.value,
    borderRadius: 10,
    height: 8,
  }))

  return (
    <Animated.View
      layout={LinearTransition.damping(14)}
      entering={FadeInUp.duration(200).delay(index * 100).springify().damping(14)}
      exiting={FadeOutUp.duration(200)}
    >

      <AnimatedTouchable

        style={[
          {
            shadowColor: isDark ? '#000' : '#64748b',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 8,
          },
        ]}
        onPressIn={() => {
          scale.value = 0.98
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }}
        onPressOut={() => {
          scale.value = 1
        }}
        className={`p-4 rounded-2xl border gap-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}
      >
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-row items-center gap-5 flex-1">
            <View className={`w-12 h-12 rounded-xl items-center justify-center ${timer.status === 'running'
              ? isDark ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-indigo-50'
              : timer.status === 'completed'
                ? isDark ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-indigo-50'
                : isDark ? 'bg-slate-700/50' : 'bg-slate-50'
              }`}>
              <Feather
                name={
                  timer.status === 'completed'
                    ? 'check-circle'
                    : timer.status === 'running'
                      ? 'activity'
                      : 'clock'
                }
                size={24}
                color={
                  timer.status === 'running' || timer.status === 'completed'
                    ? isDark ? '#818cf8' : '#6366f1'
                    : isDark ? '#94a3b8' : '#64748b'
                }
              />
            </View>
            <View className="flex-1">
              <Text className={`text-base font-semibold mb-1 ${isDark ? 'text-slate-50' : 'text-slate-900'
                }`}>
                {timer.name}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                {timer.category}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className={`w-10 h-10 rounded-xl items-center justify-center ${timer.status === 'running'
                ? isDark
                  ? 'bg-indigo-500'
                  : 'bg-indigo-500'
                : isDark
                  ? 'bg-slate-700/50'
                  : 'bg-slate-100'
                }`}
              activeOpacity={0.7}
              onPress={handlePlayPause}
              disabled={timer.status === 'completed'}
              style={{
                shadowColor: timer.status === 'running' ? '#818cf8' : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: timer.status === 'running' ? 4 : 0,
              }}
            >
              <Feather
                name={timer.status === 'running' ? 'pause' : 'play'}
                size={18}
                color={timer.status === 'running' ? '#fff' : isDark ? '#818cf8' : '#6366f1'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-10 h-10 rounded-xl items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'
                }`}
              activeOpacity={0.7}
              onPress={handleReset}
              disabled={timer.status === 'completed' && timer.remainingTime === 0}
            >
              <Feather
                name="refresh-ccw"
                size={18}
                color={isDark ? '#94a3b8' : '#64748b'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>

          <TimerProgress
            status={timer.status}
            progressPercentage={progressPercentage.value}
            remainingTime={timer.remainingTime}
            progressStyle={progressStyle}
          />
        </View>

      </AnimatedTouchable>
    </Animated.View>
  )
})

export default TimerCard
