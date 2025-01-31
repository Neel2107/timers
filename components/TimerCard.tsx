import { useTheme } from '@/context/ThemeContext'
import type { Timer } from '@/context/TimerContext'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React from 'react'
import { Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

interface TimerCardProps {
  timer: Timer;
  index: number;
}

const TimerCard = ({ timer, index }: TimerCardProps) => {
  const { isDark } = useTheme()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 })
  }

  return (
    <AnimatedTouchable
      entering={FadeInDown.delay(index * 100).duration(500)}
      exiting={FadeOut}
      style={[animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`mb-3 p-4 rounded-2xl border ${isDark
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-100'
        }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-4">
          <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'
            }`}>
            {timer.name}
          </Text>
          <Text className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
            {timer.category}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className={`w-10 h-10 rounded-xl items-center justify-center ${timer.status === 'running'
                ? isDark ? 'bg-red-900/30' : 'bg-red-100'
                : isDark ? 'bg-green-900/30' : 'bg-green-100'
              }`}
            activeOpacity={0.7}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Feather
              name={timer.status === 'running' ? 'pause' : 'play'}
              size={18}
              color={timer.status === 'running'
                ? isDark ? '#f87171' : '#ef4444'
                : isDark ? '#4ade80' : '#22c55e'
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            className={`w-10 h-10 rounded-xl items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'
              }`}
            activeOpacity={0.7}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Feather
              name="refresh-ccw"
              size={18}
              color={isDark ? '#94a3b8' : '#64748b'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Progress
          </Text>
          <Text className={`text-sm font-medium ${timer.status === 'running'
              ? isDark ? 'text-green-400' : 'text-green-600'
              : isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
            {Math.round((timer.remainingTime / timer.duration) * 100)}%
          </Text>
        </View>

        <View className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'
          }`}>
          <Animated.View
            className={`h-full rounded-full ${timer.status === 'running'
                ? 'bg-green-500'
                : isDark ? 'bg-slate-600' : 'bg-slate-300'
              }`}
            style={{ width: `${(timer.remainingTime / timer.duration) * 100}%` }}
          />
        </View>
      </View>
    </AnimatedTouchable>
  )
}

export default React.memo(TimerCard)