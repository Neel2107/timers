import { HistoryItem } from '@/components/history/HistoryItem';
import { useTheme } from '@/context/ThemeContext';
import { useTimers } from '@/context/TimerContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const HistoryScreen = () => {
  const { isDark } = useTheme();
  const { history, clearHistory } = useTimers();

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all history? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            clearHistory();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <View className="flex-row justify-between items-center p-4">
        <Text
          className={`text-2xl font-bold ${isDark ? 'text-slate-50' : 'text-slate-900'
            }`}
        >
          History
        </Text>
        {history.length > 0 && (
          <TouchableOpacity
            onPress={handleClearHistory}
            className={`px-4 py-2 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'
              }`}
          >
            <Text
              className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
            >
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length > 0 ? (
        <Animated.FlatList
          entering={FadeIn.duration(300)}
          data={history.slice().reverse()}
          renderItem={({ item }) => <HistoryItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Ionicons
            name="time-outline"
            size={64}
            color={isDark ? '#475569' : '#94a3b8'}
          />
          <Text
            className={`text-lg mt-4 ${isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
          >
            No timer history yet
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;