import { GITHUB_URL, LINKDIN_URL, PORTFOLIO_URL, RESUME_URL } from '@/constants/constants'
import { useTheme } from '@/context/ThemeContext'
import { useTimers } from '@/context/TimerContext'
import { exportHistoryToJSON } from '@/utils/exportHistory'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React from 'react'
import { Alert, Linking, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const SettingsScreen = () => {
  const { theme, setTheme, isDark } = useTheme()
  const { history } = useTimers()

  const handleExportHistory = async () => {
    if (history.length === 0) {
      ToastAndroid.show('No history to export', ToastAndroid.SHORT)
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
      {/*

// Weird rendering issue when creating custom components
@TODO: Refactor this into custom component later

*/}
      <View className="p-4">
        <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
          Settings
        </Text>
        <View className="gap-4">
          {/* Links Section */}
          <View className="mb-4">
            <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              My Links
            </Text>
            <View className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <TouchableOpacity
                onPress={() => Linking.openURL(GITHUB_URL)}
                className={`p-4 flex-row items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-slate-900/30' : 'bg-slate-100'}`}>
                    <Feather name="github" size={18} color={isDark ? '#94a3b8' : '#64748b'} />
                  </View>
                  <Text className={`font-medium ml-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    GitHub
                  </Text>
                </View>
                <Feather name="external-link" size={18} color={isDark ? '#94a3b8' : '#64748b'} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL(LINKDIN_URL)}
                className={`p-4 flex-row items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                    <Feather name="linkedin" size={18} color={isDark ? '#60a5fa' : '#3b82f6'} />
                  </View>
                  <Text className={`font-medium ml-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    LinkedIn
                  </Text>
                </View>
                <Feather name="external-link" size={18} color={isDark ? '#94a3b8' : '#64748b'} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL(PORTFOLIO_URL)}
                className={`p-4 flex-row items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                    <Feather name="globe" size={18} color={isDark ? '#a78bfa' : '#8b5cf6'} />
                  </View>
                  <Text className={`font-medium ml-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Portfolio
                  </Text>
                </View>
                <Feather name="external-link" size={18} color={isDark ? '#94a3b8' : '#64748b'} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL(RESUME_URL)}
                className="p-4 flex-row items-center justify-between"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                    <Feather name="file-text" size={18} color={isDark ? '#4ade80' : '#22c55e'} />
                  </View>
                  <Text className={`font-medium ml-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Resume
                  </Text>
                </View>
                <Feather name="external-link" size={18} color={isDark ? '#94a3b8' : '#64748b'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Appearance Section */}
          <View className="mb-4">
            <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Appearance
            </Text>
            <View className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <View className={`p-4 flex-row items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
                    <Feather name="sun" size={18} color={isDark ? '#818cf8' : '#6366f1'} />
                  </View>
                  <Text className={`font-medium ml-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Theme
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  {(['system', 'light', 'dark'] as const).map((themeMode) => (
                    <TouchableOpacity
                      key={themeMode}
                      onPress={() => setTheme(themeMode)}
                      className={`px-3 py-1 rounded-full ${theme === themeMode
                        ? isDark ? 'bg-indigo-900/30' : 'bg-indigo-100'
                        : isDark ? 'bg-slate-700/50' : 'bg-slate-100'
                        }`}
                    >
                      <Text className={`text-sm capitalize ${theme === themeMode
                        ? isDark ? 'text-indigo-400' : 'text-indigo-500'
                        : isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                        {themeMode}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Data Management Section */}
          <View className="mb-4">
            <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Data Management
            </Text>
            <View className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <TouchableOpacity
                onPress={handleExportHistory}
                className="p-4 flex-row items-center"
                activeOpacity={0.7}
              >
                <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                  <Feather name="download" size={18} color={isDark ? '#60a5fa' : '#3b82f6'} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Export Timer History
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Save your timer history as JSON file
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>


    </SafeAreaView>
  )
}

export default SettingsScreen