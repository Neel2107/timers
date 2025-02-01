import { useTheme } from '@/context/ThemeContext'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React, { useEffect } from 'react'
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
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
      scale.value = withSequence(
        withSpring(1.2, { damping: 12 }),
        withSpring(1, { damping: 8 })
      )
      rotation.value = withRepeat(
        withTiming(360, { duration: 20000 }),
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
      animationType="fade"
      transparent={true}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        
        className='flex-1 items-center justify-center bg-black/50'
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <Animated.View
            entering={SlideInDown.springify().damping(15)}
            exiting={SlideOutDown.springify().damping(15)}
            className={`p-6  rounded-3xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}
          >
            <View className="items-center h-96 w-96 ">
              <Animated.View
                style={iconStyle}
                className={`w-44 h-4w-44 rounded-2xl items-center justify-center mb-6 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'
                  }`}
              >
                <Feather
                  name="check-circle"
                  size={48}
                  color={isDark ? '#818cf8' : '#6366f1'}
                />
              </Animated.View>

              <Animated.Text
                entering={FadeIn.delay(300)}
                className={`text-2xl font-bold text-center mb-2 ${isDark ? 'text-slate-50' : 'text-slate-900'
                  }`}
              >
                Timer Completed! 🎉
              </Animated.Text>

              <Animated.Text
                entering={FadeIn.delay(400)}
                className={`text-base text-center mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
              >
                Great job completing{'\n'}"{timerName}"
              </Animated.Text>

              <AnimatedTouchable
                entering={FadeIn.delay(500)}
                exiting={FadeOut}
                onPress={onClose}
                className={`w-full py-4 rounded-xl ${isDark ? 'bg-indigo-500' : 'bg-indigo-500'
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
        </TouchableWithoutFeedback>
      </TouchableOpacity>

    </Modal>
  )
}