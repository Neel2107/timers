import { useTheme } from '@/context/ThemeContext'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export const EmptyHistory = () => {
    const { isDark } = useTheme()

    const handleCreateTimer = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        router.push('/(auth)/home')
    }

    return (
        <View
            className={`p-8 rounded-2xl border items-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}
        >
            <View
                className={`w-20 h-20 rounded-2xl items-center justify-center mb-6 ${isDark
                        ? 'bg-indigo-500/10 border border-indigo-500/20'
                        : 'bg-indigo-50 border border-indigo-100'
                    }`}
            >
                <Ionicons
                    name="time-outline"
                    size={36}
                    color={isDark ? '#818cf8' : '#6366f1'}
                />
            </View>
            <Text
                className={`text-xl font-semibold mb-2 ${isDark ? 'text-slate-50' : 'text-slate-900'
                    }`}
            >
                Your History is Empty
            </Text>
            <Text
                className={`text-base text-center mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
            >
                Start and complete your first timer{'\n'}to see it appear here
            </Text>
            <TouchableOpacity
                onPress={handleCreateTimer}
                className="flex-row items-center px-6 py-3 rounded-xl bg-indigo-500"
                style={{
                    shadowColor: '#6366f1',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                }}
                activeOpacity={0.8}
            >
                <Ionicons name="add-outline" size={24} color="#ffffff" />
                <Text className="text-white font-medium text-base ml-2">
                    Create Timer
                </Text>
            </TouchableOpacity>
        </View>
    )
}