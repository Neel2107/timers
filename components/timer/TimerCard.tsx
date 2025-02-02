import { useTheme } from '@/context/ThemeContext'
import type { Timer } from '@/context/TimerContext'
import { formatTime } from '@/utils/helpers'
import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
  FadeInUp,
  FadeOutUp,
  interpolateColor,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue
} from 'react-native-reanimated'
import { TimerProgress } from './TimerProgress'


interface TimerCardProps {
  timer: Timer;
  index: number;
  onPlayPause: (id: number) => void;
  onReset: (id: number) => void;
  progressPercentage: number;
}

const TimerCard = ({ timer, index, onPlayPause, onReset, progressPercentage }: TimerCardProps) => {
  const { isDark } = useTheme()


  const progress = useDerivedValue(() => {
    return timer ? 1 - (timer.remainingTime / timer.duration) : 0
  }, [timer.remainingTime, timer.duration])
  // Force re-render when theme changes
  const progressColor = useDerivedValue(() => {
    if (!timer || timer.status === 'completed') {
      return isDark ? '#818cf8' : '#6366f1'
    }
    return interpolateColor(
      progress.value,
      [0, 0.3, 0.7, 1],
      isDark
        ? ['#818cf8', '#84cc16', '#f97316', '#ef4444']
        : ['#6366f1', '#65a30d', '#ea580c', '#dc2626']
    )
  }, [isDark, timer.status])


  const progressStyle = useAnimatedStyle(() => {
    const progressWidth = timer ? (1 - timer.remainingTime / timer.duration) * 100 : 0;
    return {
      width: `${progressWidth}%`,
      backgroundColor: progressColor.value,
      borderRadius: 10,
      height: 8,
    }
  }, [timer.remainingTime, timer.duration])

  return (
    <Animated.View
      layout={LinearTransition.damping(14)}
      entering={FadeInUp.duration(200).delay(index * 100).springify().damping(14)}
      exiting={FadeOutUp.duration(200)}
      className={"gap-5"}
    >
      <View className="flex-row items-center justify-between gap-4">
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
            <Text className={`text-base font-semibold mb-1 ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
              {timer.name}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {timer.category} • {formatTime(timer.duration)}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-4">
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
            onPress={() => onPlayPause(timer.id)}
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
              size={25}
              color={timer.status === 'running' ? '#fff' : isDark ? '#818cf8' : '#6366f1'}
            />
          </TouchableOpacity>


          <TouchableOpacity
            className={`w-10 h-10 rounded-xl items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'
              }`}
            activeOpacity={0.7}
            onPress={() => onReset(timer.id)}
            disabled={timer.status === 'completed' && timer.remainingTime === 0}
          >
            <Feather
              name="refresh-ccw"
              size={25}
              color={isDark ? '#94a3b8' : '#64748b'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View>

        <TimerProgress
          status={timer.status}
          progressPercentage={progressPercentage}
          remainingTime={timer.remainingTime}
          progressStyle={progressStyle}
        />
      </View>


    </Animated.View >
  )
}

export default TimerCard
