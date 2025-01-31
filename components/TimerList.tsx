import { useTheme } from '@/context/ThemeContext'
import type { Timer } from '@/context/TimerContext'
import { Feather } from '@expo/vector-icons'
import React, { useCallback, useMemo, useState } from 'react'
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeInUp, FadeOut, LinearTransition } from 'react-native-reanimated'
import { useTimers } from '../context/TimerContext'
import TimerCard from './TimerCard'

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
        <TouchableOpacity
          onPress={() => toggleCategory(category)}
          className={`flex-row items-center justify-between py-4 rounded-2xl ${isDark ? 'bg-slate-800/90' : 'bg-white'
            } shadow-sm`}

          activeOpacity={0.7}
        >
          <View className="flex-row items-center space-x-3">
            <View className={`w-10 h-10 rounded-xl items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'
              }`}>
              <Feather
                name="clock"
                size={20}
                color={isDark ? '#94a3b8' : '#64748b'}
              />
            </View>
            <View>
              <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'
                }`}>
                {category}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                {timers.length} {timers.length === 1 ? 'timer' : 'timers'}
              </Text>
            </View>
          </View>
          <Feather
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={isDark ? '#94a3b8' : '#64748b'}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View className="mt-2 space-y-2 px-1">
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
      <View className={`w-16 h-16 rounded-2xl items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'
        }`}>
        <Feather
          name="clock"
          size={32}
          color={isDark ? '#60a5fa' : '#3b82f6'}
        />
      </View>
      <Text className={`text-lg font-semibold mt-4 ${isDark ? 'text-white' : 'text-slate-800'
        }`}>
        No timers yet
      </Text>
      <Text className={`text-sm text-center mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'
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
        { flexGrow: 1 },
        timers.length === 0 && { flex: 1 }
      ]}
      ListEmptyComponent={EmptyComponent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={isDark ? '#60a5fa' : '#3b82f6'}
          colors={[isDark ? '#60a5fa' : '#3b82f6']}
          progressBackgroundColor={isDark ? '#1e293b' : '#f1f5f9'}
        />
      }
      showsVerticalScrollIndicator={false}
      windowSize={5}
      maxToRenderPerBatch={5}
      initialNumToRender={4}
      removeClippedSubviews={true}
    />
  )
}

export default React.memo(TimerList)