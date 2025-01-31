import { useTheme } from '@/context/ThemeContext'
import type { Timer } from '@/context/TimerContext'
import { Feather } from '@expo/vector-icons'
import React, { useCallback, useMemo, useState } from 'react'
import { RefreshControl, Text, View } from 'react-native'
import Animated, { FadeIn, FadeInUp, FadeOut, LinearTransition } from 'react-native-reanimated'
import { useTimers } from '../context/TimerContext'
import CategoryHeader from './CategoryHeader'
import TimerCard from './TimerCard'

const AnimatedFeather = Animated.createAnimatedComponent(Feather)

const TimerList = () => {
  const { isDark } = useTheme()
  const { timers, loadTimers } = useTimers()
  const [refreshing, setRefreshing] = React.useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  // Group timers by category
  const groupedTimers = useMemo(() => {
    const groups: { [key: string]: Timer[] } = {}
    timers.forEach(timer => {
      if (!groups[timer.category]) {
        groups[timer.category] = []
      }
      groups[timer.category].push(timer)
    })
    return groups
  }, [timers])

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }, [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadTimers()
    setRefreshing(false)
  }, [loadTimers])

  const renderCategory = useCallback(({ category, timers }: { category: string, timers: Timer[] }) => {
    const isExpanded = expandedCategories.includes(category)

    return (
      <Animated.View
        className="mb-3"
        entering={FadeInUp.duration(400).springify().damping(14)}
        exiting={FadeOut.duration(300)}
        layout={LinearTransition.damping(14)}
      >
        <CategoryHeader
          category={category}
          count={timers.length}
          isExpanded={isExpanded}
          onToggle={() => toggleCategory(category)}
        />

        {isExpanded && (
          <View className="mt-2 gap-2 px-1">
            {timers.map((timer, index) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                index={index}
              />
            ))}
          </View>
        )}
      </Animated.View>
    )
  }, [isDark, expandedCategories, toggleCategory])

  const EmptyComponent = useCallback(() => (
    <Animated.View
      entering={FadeIn.duration(500)}
      className="flex-1 justify-center items-center px-4"
    >
      <View className={`w-16 h-16 rounded-2xl items-center justify-center ${isDark ? 'bg-app-card-dark' : 'bg-app-card-light'
        }`}>
        <Feather
          name="clock"
          size={32}
          color={isDark ? 'rgb(129, 140, 248)' : 'rgb(99, 102, 241)'}
        />
      </View>
      <Text className={`text-lg font-semibold mt-4 ${isDark ? 'text-content-primary-dark' : 'text-content-primary-light'
        }`}>
        No timers yet
      </Text>
      <Text className={`text-sm text-center mt-2 ${isDark ? 'text-content-secondary-dark' : 'text-content-secondary-light'
        }`}>
        Create your first timer by tapping the + button
      </Text>
    </Animated.View>
  ), [isDark])

  return (
    <Animated.FlatList
      itemLayoutAnimation={LinearTransition.damping(14)}
      data={Object.entries(groupedTimers)}
      renderItem={({ item: [category, categoryTimers] }) =>
        renderCategory({ category, timers: categoryTimers })}
      keyExtractor={([category]) => category}
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingBottom: 100,
        },
        timers.length === 0 && { flex: 1 }
      ]}
      ListEmptyComponent={EmptyComponent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={isDark ? 'rgb(129, 140, 248)' : 'rgb(99, 102, 241)'}
          colors={[isDark ? 'rgb(129, 140, 248)' : 'rgb(99, 102, 241)']}
          progressBackgroundColor={isDark ? '#1e293b' : '#f8fafc'}
        />
      }
      showsVerticalScrollIndicator={false}
      windowSize={5}
      maxToRenderPerBatch={5}
      initialNumToRender={4}
      removeClippedSubviews={true}
      snapToAlignment="start"
      decelerationRate="fast"
      bounces={true}
    />
  )
}

export default React.memo(TimerList)