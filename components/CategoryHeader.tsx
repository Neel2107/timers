import { useTheme } from '@/context/ThemeContext'
import { useTimers } from '@/context/TimerContext'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React, { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring
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
  const { startCategoryTimers, pauseCategoryTimers, resetCategoryTimers } = useTimers();
  const rotateZ = useSharedValue(0)


  const handleAction = (action: 'start' | 'pause' | 'reset') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    switch (action) {
      case 'start':
        startCategoryTimers(category);
        break;
      case 'pause':
        pauseCategoryTimers(category);
        break;
      case 'reset':
        resetCategoryTimers(category);
        break;
    }
  };

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
    <Animated.View
      layout={LinearTransition.springify().damping(14)}
      className={"gap-5"}
     
    >
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View className='flex-row items-center justify-between w-full'>


          <View className="flex-row items-center gap-3">
            <View className={`w-10 h-10 rounded-xl items-center justify-center ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'
              }`}>
              <Feather
                name="clock"
                size={20}
                color={isDark ? '#94a3b8' : '#64748b'}
              />
            </View>
            <View>
              <Text className={`text-base font-medium ${isDark ? 'text-slate-50' : 'text-slate-900'
                }`}>
                {category}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'
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
        </View>
      </TouchableOpacity>

      {isExpanded &&
        <Animated.View
          entering={FadeIn.delay(100)}
          layout={LinearTransition.damping(14)}
          className="flex-row gap-2 "
        >
          <TouchableOpacity
            onPress={() => handleAction('start')}
            className={`flex-1 flex-row items-center justify-center py-3 px-4 gap-1 rounded-xl border ${isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
              }`}
            activeOpacity={0.7}
          >
            <Feather
              name="play"
              size={16}
              color={isDark ? '#818cf8' : '#6366f1'}
            />
            <Text className={`ml-2 font-medium ${isDark ? 'text-slate-50' : 'text-slate-900'
              }`}>
              Start All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAction('pause')}
            className={`flex-1 flex-row items-center justify-center py-3 px-4 gap-1 rounded-xl border ${isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
              }`}
            activeOpacity={0.7}
          >
            <Feather
              name="pause"
              size={16}
              color={isDark ? '#818cf8' : '#6366f1'}
            />
            <Text className={`ml-2 font-medium ${isDark ? 'text-slate-50' : 'text-slate-900'
              }`}>
              Pause All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAction('reset')}
            className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl gap-1 border ${isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
              }`}
            activeOpacity={0.7}
          >
            <Feather
              name="refresh-ccw"
              size={16}
              color={isDark ? '#818cf8' : '#6366f1'}
            />
            <Text className={`ml-2 font-medium ${isDark ? 'text-slate-50' : 'text-slate-900'
              }`}>
              Reset All
            </Text>
          </TouchableOpacity>
        </Animated.View>}
    </Animated.View>
  )
}

export default React.memo(CategoryHeader)