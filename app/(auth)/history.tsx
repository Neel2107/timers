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
      <View className="p-4">
        <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
          History
        </Text>

        <View className="gap-6">
          {/* History Stats Section */}
          <View>
            <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Overview
            </Text>
            <View className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className={`w-10 h-10 rounded-xl items-center justify-center ${
                    isDark ? 'bg-slate-700' : 'bg-slate-100'
                  }`}>
                    <Ionicons
                      name="time-outline"
                      size={24}
                      color={isDark ? '#94a3b8' : '#64748b'}
                    />
                  </View>
                  <View className="ml-3">
                    <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Completed Timers
                    </Text>
                    <Text className={`text-lg font-semibold ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
                      {history.length}
                    </Text>
                  </View>
                </View>
                {history.length > 0 && (
                  <TouchableOpacity
                    onPress={handleClearHistory}
                    className={`px-4 py-2 rounded-xl ${
                      isDark ? 'bg-slate-700/50' : 'bg-slate-100'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      Clear All
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* History List Section */}
          <View className="flex-1">
            <Text className={`text-base font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Recent Activity
            </Text>
            
            {history.length > 0 ? (
              <Animated.FlatList
                entering={FadeIn.duration(300)}
                data={history.slice().reverse()}
                renderItem={({ item }) => <HistoryItem item={item} />}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View className={`p-8 rounded-2xl border items-center ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <View className={`w-16 h-16 rounded-2xl items-center justify-center mb-4 ${
                  isDark ? 'bg-slate-700' : 'bg-slate-100'
                }`}>
                  <Ionicons
                    name="hourglass-outline"
                    size={32}
                    color={isDark ? '#94a3b8' : '#64748b'}
                  />
                </View>
                <Text className={`text-lg font-medium mb-1 ${
                  isDark ? 'text-slate-50' : 'text-slate-900'
                }`}>
                  No History Yet
                </Text>
                <Text className={`text-sm text-center ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Complete your first timer to see it here
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;