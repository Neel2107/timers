import { useTheme } from '@/context/ThemeContext'
import React from 'react'
import { Text, View } from 'react-native'

interface TimerInfoProps {
  name: string
  category: string
}

export const TimerInfo = ({ name, category }: TimerInfoProps) => {
  const { isDark } = useTheme()

  return (
    <View className="flex-1">
      <Text className={`text-xl font-bold mb-1 ${
        isDark ? 'text-white' : 'text-slate-800'
      }`}>
        {name}
      </Text>
      <Text className={`text-base ${
        isDark ? 'text-slate-400' : 'text-slate-500'
      }`}>
        {category}
      </Text>
    </View>
  )
}