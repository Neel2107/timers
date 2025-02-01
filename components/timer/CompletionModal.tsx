import { useTheme } from '@/context/ThemeContext'
import * as Haptics from 'expo-haptics'
import LottieView from 'lottie-react-native'
import React, { useEffect, useRef } from 'react'
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
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
  const animation = useRef<LottieView>(null);


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


  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className='flex-1 items-center justify-center '
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableWithoutFeedback>
          <Animated.View
            className={`p-6  rounded-3xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}
          >
            <View className="items-center  w-96 ">
              <View className="flex items-center justify-center">
                <LottieView
                  autoPlay
                  ref={animation}
                  source={
                    isDark ? require('@assets/animations/timers-congo.json') :
                      require('@assets/animations/timers-congo-light.json')}
                  style={{
                    width: 160,
                    height: 160,
                    backgroundColor: 'transparent',
                  }}
                />
              </View>

              <Animated.Text
                entering={FadeIn.delay(100)}
                className={`text-2xl font-bold text-center mb-2 ${isDark ? 'text-slate-50' : 'text-slate-900'
                  }`}
              >
                Timer Completed! 🎉
              </Animated.Text>

              <Animated.Text
                entering={FadeIn.delay(200)}
                className={`text-base text-center mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
              >
                Great job completing{'\n'}"{timerName}"
              </Animated.Text>

              <AnimatedTouchable
                entering={FadeIn.delay(300)}
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