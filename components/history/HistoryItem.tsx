import { useTheme } from '@/context/ThemeContext';
import type { TimerHistoryItem } from '@/context/TimerContext';
import { format } from 'date-fns';
import React from 'react';
import { Text, View } from 'react-native';

interface HistoryItemProps {
  item: TimerHistoryItem;
}

export const HistoryItem = ({ item }: HistoryItemProps) => {
  const { isDark } = useTheme();

  return (
    <View
      className={`p-4 rounded-2xl border mb-3 ${isDark
          ? 'bg-slate-800/90 border-slate-700/30'
          : 'bg-white/90 border-slate-200/30'
        }`}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text
            className={`text-lg font-semibold mb-1 ${isDark ? 'text-slate-50' : 'text-slate-900'
              }`}
          >
            {item.name}
          </Text>
          <Text
            className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
          >
            {item.category} • {format(item.duration * 1000, 'mm:ss')}
          </Text>
        </View>
        <Text
          className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
        >
          {format(new Date(item.completedAt), 'MMM d, h:mm a')}
        </Text>
      </View>
    </View>
  );
};