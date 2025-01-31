import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/context/ThemeContext'

const HistoryScreen = () => {
  const { isDark } = useTheme()

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'} p-4`}>
      <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
        History
      </Text>
      
      <View className="flex-1 justify-center items-center">
        <Ionicons 
          name="time-outline" 
          size={64} 
          color={isDark ? '#4b5563' : '#CBD5E1'} 
        />
        <Text className={`text-lg mt-4 ${isDark ? 'text-gray-400' : 'text-slate-400'}`}>
          No timer history yet
        </Text>
      </View>
    </View>
  )
}

export default HistoryScreen