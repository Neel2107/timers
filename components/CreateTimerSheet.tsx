import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTimers } from '../context/TimerContext';

const predefinedCategories = ['Workout', 'Study', 'Break', 'Meditation', 'Custom'];

interface CreateTimerSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  isOpen: boolean;
  onClose: () => void;
}



const CreateTimerSheet = ({ bottomSheetRef, isOpen, onClose }: CreateTimerSheetProps) => {
  const { isDark } = useTheme()
  const { addTimer } = useTimers();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const snapPoints = useMemo(() => ['75%'], []);

  const resetForm = () => {
    setName('');
    setDuration('');
    setCategory('');
    setShowCustomCategory(false);
  };

  const handleCreateTimer = useCallback(() => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a timer name');
      return;
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Error', 'Please enter a valid duration');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    addTimer({
      name: name.trim(),
      duration: durationNum,
      category: category.trim(),
    });

    resetForm();
    onClose();
  }, [name, duration, category, addTimer, onClose]);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const handleSheetClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const handleCategoryPress = useCallback((cat: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setCategory(cat)
    setShowCustomCategory(cat === 'Custom')
  }, [])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isOpen ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={handleSheetClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        backgroundColor: isDark ? '#475569' : '#94a3b8',
        width: 40,
        height: 4
      }}
      backgroundStyle={{
        backgroundColor: isDark ? '#0f172a' : '#ffffff'
      }}
      enableOverDrag={true}
    >
      <Animated.View
        entering={FadeIn.duration(300)}
        className="flex-1 px-6 pt-4"
      >
        <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
          Create Timer
        </Text>
        <Text className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Set up your new timer details
        </Text>

        <View className="gap-5">
          <View>
            <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Timer Name
            </Text>
            <View className={`flex-row items-center rounded-xl border px-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
              <Feather
                name="clock"
                size={18}
                color={isDark ? '#94a3b8' : '#64748b'}
              />
              <TextInput
                className={`flex-1 py-3 px-2 text-base ${isDark ? 'text-slate-50' : 'text-slate-900'
                  }`}
                placeholder="e.g., Morning Workout"
                placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View>
            <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Duration
            </Text>
            <View className={`flex-row items-center rounded-xl border px-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
              <Feather
                name="clock"
                size={18}
                color={isDark ? '#94a3b8' : '#64748b'}
              />
              <TextInput
                className={`flex-1 py-3 px-2 text-base ${isDark ? 'text-slate-50' : 'text-slate-900'
                  }`}
                placeholder="Duration in seconds"
                placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                keyboardType="numeric"
                value={duration}
                onChangeText={setDuration}
              />
            </View>
          </View>

          <View>
            <Text className={`text-base font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Category
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {predefinedCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => handleCategoryPress(cat)}
                  className={`px-4 py-2.5 rounded-xl border ${category === cat
                      ? isDark
                        ? 'bg-indigo-500 border-indigo-400'
                        : 'bg-indigo-500 border-indigo-400'
                      : isDark
                        ? 'bg-slate-800/50 border-slate-700'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-sm font-medium ${category === cat
                        ? 'text-white'
                        : isDark
                          ? 'text-slate-300'
                          : 'text-slate-700'
                      }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {showCustomCategory && (
              <View className={`mt-3 flex-row items-center rounded-xl border px-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                <Feather
                  name="tag"
                  size={18}
                  color={isDark ? '#94a3b8' : '#64748b'}
                />
                <TextInput
                  className={`flex-1 py-3 px-2 text-base ${isDark ? 'text-slate-50' : 'text-slate-900'
                    }`}
                  placeholder="Enter custom category"
                  placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                  value={category === 'Custom' ? '' : category}
                  onChangeText={setCategory}
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleCreateTimer}
            className={`w-full py-4 rounded-xl ${
              isDark ? 'bg-indigo-500' : 'bg-indigo-500'
            }`}
            style={{
              shadowColor: '#6366f1',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
              // transform: [{ translateZ: 0 }], // This helps with shadow rendering
            }}
            activeOpacity={0.8}
          >
            <View 
              className="absolute inset-0 rounded-xl"
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                borderRadius: 12,
              }}
            />
            <Text className="text-white text-center text-base font-semibold">
              Create Timer
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </BottomSheet>
  )
}

export default CreateTimerSheet