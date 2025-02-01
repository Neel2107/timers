import React from 'react'
import { Text } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

interface AnimatedErrorProps {
  alert: string
}

const AnimatedError = ({ alert }: AnimatedErrorProps) => {
  return (
    <Animated.View
      entering={FadeIn.duration(200).delay(100)}
      exiting={FadeOut.duration(200)}
    >
      <Text className={`text-sm text-red-500 mt-1`}>
        {alert}
      </Text>
    </Animated.View>
  )
}

export default AnimatedError