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

const CreateTimerSheet = ({ bottomSheetRef, isOpen, onClose }: CreateTimerSheetProps) => {
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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isOpen ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={handleSheetClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: '#999' }}
      enableOverDrag={true}
      style={{ flex: 1 }}
    >
      <BottomSheetView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">Create New Timer</Text>

        <View className="space-y-4">
          <View>
            <Text className="text-base font-medium mb-2">Timer Name</Text>
            <TextInput
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="e.g., Morning Workout"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className="text-base font-medium mb-2">Duration (seconds)</Text>
            <TextInput
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="e.g., 300 (5 minutes)"
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
          </View>

          <View>
            <Text className="text-base font-medium mb-2">Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {predefinedCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    setCategory(cat);
                    setShowCustomCategory(cat === 'Custom');
                  }}
                  className={`px-4 py-2 rounded-full border ${category === cat ? 'bg-blue-500 border-blue-500' : 'border-gray-200'
                    }`}
                >
                  <Text
                    className={`${category === cat ? 'text-white' : 'text-gray-700'
                      }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {showCustomCategory && (
              <TextInput
                className="w-full mt-2 p-3 border border-gray-200 rounded-lg"
                placeholder="Enter custom category"
                value={category === 'Custom' ? '' : category}
                onChangeText={setCategory}
              />
            )}
          </View>

          <TouchableOpacity
            onPress={handleCreateTimer}
            className="w-full bg-blue-500 p-4 rounded-lg mt-4"
          >
            <Text className="text-white text-center font-medium">Create Timer</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CreateTimerSheet;