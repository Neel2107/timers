import { useTheme } from '@/context/ThemeContext';
import { Timer } from '@/context/TimerContext';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown
} from 'react-native-reanimated';

interface AlertModalProps {
  isVisible: boolean;
  timer: Timer;
  percentage: number;
  onClose: () => void;
}

const AlertModal = ({
  isVisible,
  timer,
  percentage,
  onClose,
}: AlertModalProps) => {
  const { isDark } = useTheme();

  if (!isVisible) return null;

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="absolute inset-0 bg-black/50 justify-end z-50"
      style={{ elevation: 1000 }}
    >
      <TouchableOpacity
        className="absolute inset-0"
        onPress={onClose}
        activeOpacity={1}
      />

      <Animated.View
        entering={SlideInDown.springify().damping(15)}
        exiting={SlideOutDown.springify().damping(15)}
        className={`p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-t-3xl z-50`}
        style={{ elevation: 1001 }}
      >
        <View className="flex-row items-center gap-4 mb-4">
          <View className={`w-12 h-12 rounded-xl items-center justify-center 
            ${isDark ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
            <Feather
              name="bell"
              size={24}
              color={isDark ? '#fb923c' : '#f97316'}
            />
          </View>
          <View className="flex-1">
            <Text className={`text-xl font-bold ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
              Timer Alert
            </Text>
            <Text className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {timer.name}
            </Text>
          </View>
        </View>

        <Text className={`text-lg mb-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Timer is {percentage}% complete!
        </Text>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onClose();
          }}
          className={`p-4 rounded-2xl ${isDark ? 'bg-orange-500' : 'bg-orange-500'}`}
          style={{
            shadowColor: isDark ? '#fb923c' : '#f97316',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text className="text-center font-medium text-white">
            Dismiss
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default AlertModal;