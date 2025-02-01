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
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated'
import { TimerControls } from './timer/TimerControls'
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

  // Update progressPercentage calculation to use useDerivedValue
  const progressPercentage = useDerivedValue(() =>
    Math.round((timer.remainingTime / timer.duration) * 100)
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
      className={`p-4 rounded-2xl border ${isDark
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-slate-200'
        }`}
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-row items-center gap-4 flex-1">
          <View className={`w-12 h-12 rounded-xl items-center  justify-center ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'
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
              color={isDark ? '#94a3b8' : '#64748b'}
            />
          </View>
          <View className="flex-1">
            <Text className={`text-xl font-bold mb-1 ${isDark ? 'text-slate-50' : 'text-slate-900'
              }`}>
              {timer.name}
            </Text>
            <Text className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
              {timer.category}
            </Text>
          </View>
        </View>

        <View>

          <TimerControls
            status={timer.status}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            remainingTime={timer.remainingTime}
          />
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
  )
})

export default TimerCard
