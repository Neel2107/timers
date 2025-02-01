import { useTheme } from '@/context/ThemeContext'
import { Feather } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  useDerivedValue 
} from 'react-native-reanimated'

const AnimatedFeather = Animated.createAnimatedComponent(Feather)

interface CategoryHeaderProps {
  category: string
  count: number
  isExpanded: boolean
  onToggle: () => void
}

const CategoryHeader = ({ category, count, isExpanded, onToggle }: CategoryHeaderProps) => {
  const { isDark } = useTheme()
  const rotateZ = useSharedValue(0)

  useEffect(() => {
    rotateZ.value = withSpring(isExpanded ? 180 : 0, {
      damping: 15,
      stiffness: 100
    })
  }, [isExpanded])

  // Use useDerivedValue for rotation calculation
  const rotation = useDerivedValue(() => `${rotateZ.value}deg`)

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: rotation.value }]
  }))

  return (
    <TouchableOpacity
      onPress={onToggle}
      className={`flex-row items-center justify-between py-4 px-4 rounded-2xl ${
        isDark ? 'bg-slate-800/90' : 'bg-white'
      } shadow-sm`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center gap-3">
        <View className={`w-10 h-10 rounded-xl items-center justify-center ${
          isDark ? 'bg-slate-700' : 'bg-slate-100'
        }`}>
          <Feather
            name="clock"
            size={20}
            color={isDark ? '#94a3b8' : '#64748b'}
          />
        </View>
        <View>
          <Text className={`text-base font-semibold ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}>
            {category}
          </Text>
          <Text className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {count} {count === 1 ? 'timer' : 'timers'}
          </Text>
        </View>
      </View>
      <AnimatedFeather
        name="chevron-down"
        size={20}
        color={isDark ? '#94a3b8' : '#64748b'}
        style={chevronStyle}
      />
    </TouchableOpacity>
  )
}

export default React.memo(CategoryHeader)