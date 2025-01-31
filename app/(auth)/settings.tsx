import { useTheme } from '@/context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SettingsScreen = () => {
  const { theme, setTheme, isDark } = useTheme()

  const themeOptions = [
    { id: 'light', icon: 'sunny-outline', label: 'Light' },
    { id: 'dark', icon: 'moon-outline', label: 'Dark' },
    { id: 'system', icon: 'settings-outline', label: 'System' },
  ] as const

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'} p-4`}>
      <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
        Settings
      </Text>

      <View className="space-y-4">
        <Text className={`text-base font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Appearance
        </Text>

        <View className="flex-row gap-3">
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => setTheme(option.id)}
              className={`flex-1 p-4 rounded-xl border ${theme === option.id
                  ? isDark
                    ? 'bg-blue-900 border-blue-800'
                    : 'bg-blue-50 border-blue-200'
                  : isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-200'
                }`}
            >
              <View className="items-center space-y-2">
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={
                    theme === option.id
                      ? isDark
                        ? '#60a5fa'
                        : '#3b82f6'
                      : isDark
                        ? '#9ca3af'
                        : '#6b7280'
                  }
                />
                <Text
                  className={`text-sm ${theme === option.id
                      ? isDark
                        ? 'text-blue-400'
                        : 'text-blue-600'
                      : isDark
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                >
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose how Neel Timers appears to you. Select 'System' to automatically match your device's appearance settings.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SettingsScreen