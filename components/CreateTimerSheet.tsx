import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTimers } from '../context/TimerContext';

const predefinedCategories = ['Workout', 'Study', 'Break', 'Meditation', 'Custom'];

interface CreateTimerSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  isOpen: boolean;
  onClose: () => void;
}

// Add to imports
import { useTheme } from '@/context/ThemeContext'
import * as Haptics from 'expo-haptics'

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
      handleIndicatorStyle={{ backgroundColor: isDark ? '#4b5563' : '#9ca3af' }}
      backgroundStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff' }}
      enableOverDrag={true}
      style={{ flex: 1 }}
    >
      <View className="flex-1 p-4">
        <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
          Create New Timer
        </Text>

        <View className="space-y-4">
          <View>
            <Text className={`text-base font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Timer Name
            </Text>
            <TextInput
              className={`w-full p-3 rounded-lg ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-gray-50 border-gray-200 text-black'
              }`}
              placeholder="e.g., Morning Workout"
              placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className={`text-base font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Duration (seconds)
            </Text>
            <TextInput
              className={`w-full p-3 rounded-lg ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-gray-50 border-gray-200 text-black'
              }`}
              placeholder="e.g., 300 (5 minutes)"
              placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
          </View>

          <View>
            <Text className={`text-base font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Category
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {predefinedCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => handleCategoryPress(cat)}
                  className={`px-4 py-2 rounded-full border ${
                    category === cat 
                      ? isDark 
                        ? 'bg-blue-900 border-blue-800' 
                        : 'bg-blue-500 border-blue-500'
                      : isDark
                        ? 'border-gray-700'
                        : 'border-gray-200'
                  }`}
                >
                  <Text
                    className={category === cat 
                      ? 'text-white' 
                      : isDark 
                        ? 'text-gray-300' 
                        : 'text-gray-700'
                    }
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {showCustomCategory && (
              <TextInput
                className={`w-full mt-2 p-3 rounded-lg ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-gray-50 border-gray-200 text-black'
                }`}
                placeholder="Enter custom category"
                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                value={category === 'Custom' ? '' : category}
                onChangeText={setCategory}
              />
            )}
          </View>

          <TouchableOpacity
            onPress={handleCreateTimer}
            className={`w-full p-4 rounded-lg mt-4 ${
              isDark ? 'bg-blue-600' : 'bg-blue-500'
            }`}
          >
            <Text className="text-white text-center font-medium">
              Create Timer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  )
}

export default CreateTimerSheet;