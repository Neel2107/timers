import { useTheme } from '@/context/ThemeContext'
import type { Timer } from '@/context/TimerContext'
import { useTimers } from '@/context/TimerContext'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { View } from 'react-native'
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
import { TimerControls } from './timer/TimerControls'
import { TimerInfo } from './timer/TimerInfo'
import { TimerProgress } from './timer/TimerProgress'

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

  // Enhanced interval logic with time drift compensation
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
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }
  }, [timer.status, timer.remainingTime, timer.id, updateRemainingTime])

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
        ? ['#ff6b6b', '#ffa502', '#2ed573', '#1dd1a1']
        : ['#ff4757', '#ff9f1a', '#2ed573', '#10ac84']
    )
  })

  const progressStyle = useAnimatedStyle(() => ({
    width: `${(1 - progress.value) * 100}%`,
    backgroundColor: progressColor.value,
    borderRadius: 10,
    height: 8,
  }))

  return (
    <AnimatedTouchable
      entering={FadeInUp.duration(400).delay(index * 50).springify()}
      exiting={FadeOutUp.duration(300)}
      layout={LinearTransition.springify()}
      style={[
        {
          shadowColor: isDark ? '#000' : '#64748b',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.6 : 0.15,
          shadowRadius: 16,
          elevation: 12,
        },
        animatedStyle
      ]}
      onPressIn={() => {
        scale.value = 0.98
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }}
      onPressOut={() => {
        scale.value = 1
      }}
      className={`p-6 rounded-2xl border ${
        isDark
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
      }`}
    >
      <View className="flex-row items-start justify-between gap-6">
        <View className="flex-row items-center gap-5 flex-1">
          <View className={`w-16 h-16 rounded-2xl items-center justify-center ${timer.status === 'completed'
              ? isDark ? 'bg-status-success-dark/15' : 'bg-status-success-light/15'
              : timer.status === 'running'
                ? isDark ? 'bg-brand-secondary-dark/15' : 'bg-brand-secondary/15'
                : isDark ? 'bg-content-secondary-dark/15' : 'bg-content-secondary-light/15'
            }`}>
            <Feather
              name={
                timer.status === 'completed'
                  ? 'check-circle'
                  : timer.status === 'running'
                    ? 'activity'
                    : 'clock'
              }
              size={32}
              color={
                timer.status === 'completed'
                  ? isDark ? 'rgb(110, 231, 183)' : 'rgb(5, 150, 105)'
                  : timer.status === 'running'
                    ? isDark ? 'rgb(129, 140, 248)' : 'rgb(99, 102, 241)'
                    : isDark ? 'rgb(148, 163, 184)' : 'rgb(100, 116, 139)'
              }
            />
          </View>
          <TimerInfo
            name={timer.name}
            category={timer.category}
          />
        </View>

        <TimerControls
          status={timer.status}
          onPlayPause={handlePlayPause}
          onReset={handleReset}
          remainingTime={timer.remainingTime}
        />
      </View>

      <TimerProgress
        status={timer.status}
        progressPercentage={progressPercentage}
        remainingTime={timer.remainingTime}
        progressStyle={progressStyle}
      />
    </AnimatedTouchable>
  )
})

export default TimerCard
