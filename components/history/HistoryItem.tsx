import { useTheme } from '@/context/ThemeContext';
import type { TimerHistoryItem } from '@/context/TimerContext';
import { truncateText } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface HistoryItemProps {
  item: TimerHistoryItem;
}

export const HistoryItem = ({ item }: HistoryItemProps) => {
  const { isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className={`mb-3 p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}

    >
      <View className="flex-row items-center gap-3">
        <View className={`w-12 h-12  rounded-full items-center justify-center ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'
          }`}>
          <Ionicons
            name="checkmark-circle-outline"
            size={24}
            color={isDark ? '#818cf8' : '#6366f1'}
          />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              className={`text-base font-semibold 
            
            ${isDark ? 'text-slate-50' : 'text-slate-900'
                }`}>
              {truncateText(item.name, 40)}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
              {format(new Date(item.completedAt), 'h:mm a')}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mt-1">
            <View className="flex-row items-center gap-2">
              <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                {item.category}
              </Text>
              <Text className={`text-sm mx-1 ${isDark ? 'text-slate-600' : 'text-slate-300'
                }`}>•</Text>
              <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                {Math.floor(item.duration / 60)}m {item.duration % 60}s
              </Text>
            </View>
            <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
              {format(new Date(item.completedAt), 'MMM d, yyyy')}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  )
}