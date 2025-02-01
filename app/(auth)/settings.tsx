import { useTheme } from '@/context/ThemeContext'
import { useTimers } from '@/context/TimerContext'
import { exportHistoryToJSON } from '@/utils/exportHistory'
import { Feather, Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SettingsScreen = () => {
  const { theme, setTheme, isDark } = useTheme()
  const { history } = useTimers()

  const themeOptions = [
    { id: 'light', icon: 'sunny-outline', label: 'Light' },
    { id: 'dark', icon: 'moon-outline', label: 'Dark' },
    { id: 'system', icon: 'settings-outline', label: 'System' },
  ] as const

  const handleExportHistory = async () => {
    if (history.length === 0) {
      Alert.alert(
        'No History',
        'There is no timer history to export.',
        [{ text: 'OK' }]
      )
      return
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      const success = await exportHistoryToJSON(history)

      if (success) {
        Alert.alert(
          'Success',
          'Timer history has been exported successfully.',
          [{ text: 'OK' }]
        )
      } else {
        Alert.alert(
          'Error',
          'Failed to export timer history.',
          [{ text: 'OK' }]
        )
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while exporting the history.',
        [{ text: 'OK' }]
      )
    }
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <View className="p-4">
        <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
          Settings
        </Text>

        <View className="gap-6">
          {/* Theme Section */}
          <View>
            <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Appearance
            </Text>
            <View className="flex-row gap-3">
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setTheme(option.id)}
                  className={`flex-1 p-4 rounded-2xl border ${theme === option.id
                    ? isDark
                      ? 'bg-indigo-500 border-indigo-400'
                      : 'bg-indigo-500 border-indigo-400'
                    : isDark
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-white border-slate-200'
                    }`}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={theme === option.id ? '#fff' : isDark ? '#94a3b8' : '#64748b'}
                  />
                  <Text
                    className={`mt-2 text-sm font-medium ${theme === option.id
                      ? 'text-white'
                      : isDark
                        ? 'text-slate-300'
                        : 'text-slate-600'
                      }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Data Export Section */}
          <View>
            <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Data Management
            </Text>
            <TouchableOpacity
              onPress={handleExportHistory}
              className={`flex-row items-center p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}
            >
              <Ionicons
                name="download-outline"
                size={24}
                color={isDark ? '#94a3b8' : '#64748b'}
              />
              <View className="ml-3 flex-1">
                <Text className={`text-base font-medium ${isDark ? 'text-slate-50' : 'text-slate-900'
                  }`}>
                  Export Timer History
                </Text>
                <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  Save your timer history as JSON file
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          

         
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SettingsScreen