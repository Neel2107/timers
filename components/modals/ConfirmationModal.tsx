import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown
} from 'react-native-reanimated';

interface ConfirmationModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal = ({
  isVisible,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  const { isDark } = useTheme();

  if (!isVisible) return null;

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="absolute inset-0 bg-black/50 justify-end"
    >
      <TouchableOpacity
        className="absolute inset-0"
        onPress={onCancel}
        activeOpacity={1}
      />

      <Animated.View
        entering={SlideInDown.damping(15)}
        exiting={SlideOutDown.springify().damping(15)}
        className={`p-6 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-t-3xl`}
      >
        <Text className={`text-xl font-bold mb-2 ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
          {title}
        </Text>
        <Text className={`text-base mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {message}
        </Text>

        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={onCancel}
            className={`flex-1 p-4 rounded-2xl ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}
          >
            <Text className={`text-center font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onConfirm}
            className="flex-1 p-4 rounded-2xl bg-red-500"
            style={{
              shadowColor: isDark ? '#818cf8' : '#6366f1',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
            activeOpacity={0.8}
          >
            <Text className="text-center font-medium text-white">
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default ConfirmationModal;