import { useTheme } from '@/context/ThemeContext'
import type { Timer } from '@/context/TimerContext'
import { Feather } from '@expo/vector-icons'
import React, { useCallback } from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useTimers } from '../context/TimerContext'
import TimerCard from './TimerCard'

const TimerList = () => {
  const { isDark } = useTheme()
  const { timers, loadTimers } = useTimers()
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadTimers()
    setRefreshing(false)
  }, [loadTimers])

  const renderItem = useCallback(({ item: timer, index }: { item: Timer; index: number }) => (
    <TimerCard timer={timer} index={index} />
  ), [])

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
    <FlatList
      data={timers}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
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
    />
  )
}

export default React.memo(TimerList)