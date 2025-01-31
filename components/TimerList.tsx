import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { RefreshControl, ScrollView, Text, View } from 'react-native'
import { useTimers } from '../context/TimerContext'

const TimerList = () => {
  const { timers, loadTimers } = useTimers()
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    await loadTimers()
    setRefreshing(false)
  }, [loadTimers])

  if (timers.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Ionicons name="timer-outline" size={64} color="#CBD5E1" />
        <Text className="text-slate-400 text-lg mt-4">
          No timers yet. Tap + to create one!
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {timers.map((timer) => (
        <View
          key={timer.id}
          className="bg-white p-4 mb-2 rounded-lg border border-gray-100"
        >
          <Text className="text-lg font-medium">{timer.name}</Text>
          <Text className="text-gray-600">
            Duration: {timer.duration} seconds
          </Text>
          <Text className="text-gray-600">Category: {timer.category}</Text>
          <Text
            className={`${
              timer.status === 'running'
                ? 'text-green-600'
                : timer.status === 'paused'
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            Status: {timer.status}
          </Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default TimerList