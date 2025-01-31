import { useTheme } from '@/context/ThemeContext'
import type { Timer } from '@/context/TimerContext'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React from 'react'
import { Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

interface TimerCardProps {
  timer: Timer
}

const TimerCard = ({ timer }: TimerCardProps) => {
  const { isDark } = useTheme()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 })
  }

  return (
    <AnimatedTouchable
      entering={SlideInRight.springify().damping(15)}
      exiting={FadeOut}
      style={[animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`mb-3 mx-4 rounded-2xl ${isDark ? 'bg-gray-800/90' : 'bg-white'}`}
    >
      <Animated.View
        className="p-5"
        entering={FadeIn.delay(200)}
      >
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1 mr-3">
            <Text
              className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
              numberOfLines={1}
            >
              {timer.name}
            </Text>
            <View className="flex-row items-center">
              <View
                className={`h-2 w-2 rounded-full mr-2 ${timer.status === 'running'
                    ? 'bg-green-500'
                    : timer.status === 'paused'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
              />
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {timer.category}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-3">
            <TouchableOpacity
              className={`p-3 rounded-full ${isDark
                  ? timer.status === 'running' ? 'bg-red-500/20' : 'bg-green-500/20'
                  : timer.status === 'running' ? 'bg-red-100' : 'bg-green-100'
                }`}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              }}
            >
              <Ionicons
                name={timer.status === 'running' ? 'pause' : 'play'}
                size={20}
                color={timer.status === 'running'
                  ? isDark ? '#ef4444' : '#dc2626'
                  : isDark ? '#22c55e' : '#16a34a'
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              className={`p-3 rounded-full ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              }}
            >
              <Ionicons
                name="refresh"
                size={20}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-2">
          <View className="flex-row justify-between items-center mb-2">
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {timer.remainingTime} / {timer.duration}s
            </Text>
            <Text className={`text-sm font-medium ${timer.status === 'running'
                ? isDark ? 'text-green-400' : 'text-green-600'
                : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              {Math.round((timer.remainingTime / timer.duration) * 100)}%
            </Text>
          </View>

          <View className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
            <Animated.View
              className={`h-full rounded-full ${timer.status === 'running'
                  ? 'bg-green-500'
                  : isDark ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              style={{ width: `${(timer.remainingTime / timer.duration) * 100}%` }}
            />
          </View>
        </View>
      </Animated.View>
    </AnimatedTouchable>
  )
}

export default React.memo(TimerCard)