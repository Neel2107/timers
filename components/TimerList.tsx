import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useTimers } from '../context/TimerContext'
// Add at the top with other imports
import { useTheme } from '@/context/ThemeContext'
import * as Haptics from 'expo-haptics'

const TimerList = () => {
  const { isDark } = useTheme()
  const { timers, loadTimers } = useTimers()
  const [refreshing, setRefreshing] = React.useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return isDark ? 'bg-green-900/30' : 'bg-green-100'
      case 'paused':
        return isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'
      default:
        return isDark ? 'bg-red-900/30' : 'bg-red-100'
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'running':
        return isDark ? 'text-green-400' : 'text-green-700'
      case 'paused':
        return isDark ? 'text-yellow-400' : 'text-yellow-700'
      default:
        return isDark ? 'text-red-400' : 'text-red-700'
    }
  }

  const handleTimerPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  if (timers.length === 0) {
    return (
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
    )
  }

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={loadTimers}
          tintColor={isDark ? '#60a5fa' : '#3b82f6'}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {timers.map((timer) => (
        <TouchableOpacity
          key={timer.id}
          onPress={handleTimerPress}
          className={`mb-3 rounded-xl border ${
            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100'
          }`}
          style={{
            shadowColor: isDark ? '#000' : '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View className="p-4">
            <View className="flex-row justify-between items-start mb-2">
              <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {timer.name}
              </Text>
              <View className={`px-2 py-1 rounded-full ${getStatusColor(timer.status)}`}>
                <Text className={`text-xs font-medium ${getStatusTextColor(timer.status)}`}>
                  {timer.status.charAt(0).toUpperCase() + timer.status.slice(1)}
                </Text>
              </View>
            </View>
            
            <View className="space-y-1">
              <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {timer.duration} seconds
              </Text>
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-2 ${
                  isDark ? 'bg-gray-600' : 'bg-gray-300'
                }`} />
                <Text className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {timer.category}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

export default TimerList