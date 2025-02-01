import { useTheme } from '@/context/ThemeContext'
import { Redirect } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const RootScreen = () => {
  const { isDark } = useTheme()

  return (
    <SafeAreaView className={`flex-1 items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ActivityIndicator size="large" color={isDark ? '#94a3b8' : '#64748b'} />
      <Redirect href={'/(auth)/home'} />
    </SafeAreaView>
  )
}

export default RootScreen