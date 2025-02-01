import { useTheme } from '@/context/ThemeContext'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React, { useEffect } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming
} from 'react-native-reanimated'

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

interface CompletionModalProps {
  isVisible: boolean
  onClose: () => void
  timerName: string
}

export const CompletionModal = ({ isVisible, onClose, timerName }: CompletionModalProps) => {
  const { isDark } = useTheme()
  const scale = useSharedValue(1)
  const rotation = useSharedValue(0)

  useEffect(() => {
    if (isVisible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      scale.value = withRepeat(
        withSpring(1.2, { damping: 2, stiffness: 80 }),
        2,
        true
      )
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000 }),
        -1,
        false
      )
    } else {
      scale.value = 1
      rotation.value = 0
    }
  }, [isVisible])

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ]
  }))

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <Animated.View
          entering={SlideInDown.springify().damping(15)}
          exiting={SlideOutDown.springify().damping(15)}
          className={`w-[85%] rounded-3xl ${
            isDark ? 'bg-slate-800' : 'bg-white'
          }`}
          style={{
            shadowColor: isDark ? '#000' : '#64748b',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.5 : 0.2,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <View className="items-center p-6">
            <Animated.View
              style={iconStyle}
              className={`w-20 h-20 rounded-2xl items-center justify-center mb-4 ${
                isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'
              }`}
            >
              <Feather
                name="check-circle"
                size={40}
                color={isDark ? '#818cf8' : '#6366f1'}
              />
            </Animated.View>

            <Animated.Text
              entering={FadeIn.delay(300)}
              className={`text-xl font-bold text-center mb-2 ${
                isDark ? 'text-slate-50' : 'text-slate-900'
              }`}
            >
              Timer Completed! 🎉
            </Animated.Text>

            <Animated.Text
              entering={FadeIn.delay(400)}
              className={`text-base text-center mb-6 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Great job completing "{timerName}"
            </Animated.Text>

            <AnimatedTouchable
              entering={FadeIn.delay(500)}
              exiting={FadeOut}
              onPress={onClose}
              className={`w-full py-4 rounded-xl ${
                isDark ? 'bg-indigo-500' : 'bg-indigo-500'
              }`}
              style={{
                shadowColor: isDark ? '#818cf8' : '#6366f1',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center text-base font-semibold">
                Continue
              </Text>
            </AnimatedTouchable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}