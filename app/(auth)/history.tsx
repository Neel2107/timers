import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const HistoryScreen = () => {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-1 justify-center items-center">
        <Ionicons name="time-outline" size={64} color="#CBD5E1" />
        <Text className="text-slate-400 text-lg mt-4">
          No timer history yet
        </Text>
      </View>
    </View>
  )
}

export default HistoryScreen