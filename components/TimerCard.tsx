import { useTheme } from '@/context/ThemeContext'
import type { Timer } from '@/context/TimerContext'
import { useTimers } from '@/context/TimerContext'
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
import { TimerStatusIcon } from './timer/TimerStatusIcon'

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
    transform: [{ translateX: 0 }],
  }))

  return (
    <AnimatedTouchable
      entering={FadeInUp.duration(400).delay(index * 50).springify()}
      exiting={FadeOutUp.duration(300)}
      layout={LinearTransition.springify()}
      style={[
        {
          shadowColor: isDark ? '#000' : '#64748b',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: isDark ? 0.5 : 0.15,
          shadowRadius: 20,
          elevation: 10,
        }
      ]}
      className={`p-5 rounded-3xl border ${isDark
          ? 'bg-slate-800/95 border-slate-700/30'
          : 'bg-white/95 border-slate-200/30'
        }`}
    >
      <View className="flex-row items-start justify-between gap-6">
        <View className="flex-row items-center gap-5 flex-1">
          <TimerStatusIcon status={timer.status} />
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
