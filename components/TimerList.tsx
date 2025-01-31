import { useTheme } from '@/context/ThemeContext'
import type { Timer } from '@/context/TimerContext'
import { Ionicons } from '@expo/vector-icons'
import React, { useCallback } from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
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

  const renderItem = useCallback(({ item: timer }: { item: Timer }) => (
    <TimerCard timer={timer} />
  ), [])

  const EmptyComponent = useCallback(() => (
    <View className="flex-1 justify-center items-center">
      <View className={`p-6 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <Ionicons
          name="timer-outline"
          size={48}
          color={isDark ? '#4b5563' : '#9ca3af'}
        />
      </View>
      <Text className={`text-lg mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        No timers yet. Tap + to create one!
      </Text>
    </View>
  ), [isDark])

  const keyExtractor = useCallback((item: Timer) => item.id.toString(), [])

  return (
    <FlatList
      data={timers}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
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
        />
      }
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={8}
    />
  )
}

export default React.memo(TimerList)