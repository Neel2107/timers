import { predefinedCategories } from '@/constants/categories';
import { useTheme } from '@/context/ThemeContext';
import { TimerAlert } from '@/context/TimerContext';
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { useTimers } from '../context/TimerContext';
import AnimatedError from './Error/AnimatedError';
import { AlertSection } from './timer/AlertSection';


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
  const [alerts, setAlerts] = useState<TimerAlert[]>([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const [nameError, setNameError] = useState('');
  const [durationError, setDurationError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const snapPoints = useMemo(() => ['90%'], [])


  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError('Timer name is required');
      return false;
    }
    if (value.trim().length < 3) {
      setNameError('Timer name must be at least 3 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateDuration = (value: string) => {
    const durationNum = parseInt(value);
    if (!value) {
      setDurationError('Duration is required');
      return false;
    }
    if (isNaN(durationNum) || durationNum <= 0) {
      setDurationError('Duration must be a positive number');
      return false;
    }
    if (durationNum > 86400) { // 24 hours in seconds
      setDurationError('Duration cannot exceed 24 hours');
      return false;
    }
    setDurationError('');
    return true;
  };

  const validateCategory = (value: string) => {
    if (!value.trim()) {
      setCategoryError('Category is required');
      return false;
    }
    if (value === 'Custom' && !category.trim()) {
      setCategoryError('Please enter a custom category name');
      return false;
    }
    setCategoryError('');
    return true;
  };

  const resetForm = () => {
    setName('');
    setDuration('');
    setCategory('');
    setAlerts([]);
    setShowCustomCategory(false);
    setNameError('');
    setDurationError('');
    setCategoryError('');
  };



  const handleRemoveAlert = (index: number) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateTimer = useCallback(() => {
    const isNameValid = validateName(name);
    const isDurationValid = validateDuration(duration);
    const isCategoryValid = validateCategory(category);

    if (!isNameValid || !isDurationValid || !isCategoryValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const durationNum = parseInt(duration);
    addTimer({
      name: name.trim(),
      duration: durationNum,
      category: category.trim(),
      alerts: alerts.sort((a, b) => a.percentage - b.percentage),
    });

    resetForm();
    onClose();
  }, [name, duration, category, addTimer, onClose]);


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

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  // Add back handler effect
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isOpen) {
        onClose()
        return true // Prevent default back action
      }
      return false // Allow default back action
    })

    return () => backHandler.remove()
  }, [isOpen, onClose])


  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isOpen ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        backgroundColor: isDark ? '#4b5563' : '#9ca3af',
        width: 32,
        height: 4,
        borderRadius: 2,
      }}
      backgroundStyle={{
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
      }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
      >


        <Animated.View
          entering={FadeIn.duration(300)}
          layout={LinearTransition.damping(15)}
          className="flex-1 px-6 pt-4"
        >
          <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
            Create Timer
          </Text>
          <Text className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Set up your new timer details
          </Text>

          <View className="gap-6">
            {/* Timer Name Input */}
            <View>
              <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Timer Name
              </Text>
              <View className='gap-2'>


                <View className={`flex-row items-center rounded-xl border px-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-100'
                    }`}>
                    <Feather
                      name="tag"
                      size={16}
                      color={isDark ? '#818cf8' : '#6366f1'}
                    />
                  </View>
                  <TextInput
                    className={`flex-1 py-3 px-2 text-base ${isDark ? 'text-slate-50' : 'text-slate-900'}`}
                    placeholder="e.g., Morning Workout"
                    placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                    value={name}
                    onChangeText={setName}
                  />

                </View>
                {nameError && (
                  <AnimatedError
                    alert={nameError}
                  />
                )}
              </View>
            </View>

            {/* Duration Input */}
            <View className=''>
              <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Duration
              </Text>
              <View className='gap-2'>


                <View className={`flex-row items-center rounded-xl border px-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                    }`}>
                    <Feather
                      name="clock"
                      size={16}
                      color={isDark ? '#60a5fa' : '#3b82f6'}
                    />
                  </View>
                  <TextInput
                    className={`flex-1 py-3 px-2  text-base ${isDark ? 'text-slate-50' : 'text-slate-900'}`}
                    placeholder="Duration in seconds"
                    placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                    keyboardType="numeric"
                    value={duration}
                    onChangeText={setDuration}
                  />
                </View>
                {durationError && (
                  <AnimatedError
                    alert={durationError}
                  />
                )}
              </View>
            </View>

            <AlertSection
              alerts={alerts}
              onAddAlert={(percentage) => {
                setAlerts(prev => [...prev, { percentage, triggered: false }]);
              }}
              onRemoveAlert={handleRemoveAlert}
            />

            {/* Category Selection */}
            <Animated.View
              layout={LinearTransition.damping(15)}
            >
              <Text className={`text-base font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Category
              </Text>
              <View className='gap-2'>


                <View className="flex-row flex-wrap gap-2">
                  {predefinedCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => handleCategoryPress(cat)}
                      className={`px-4 py-2.5 rounded-full border ${category === cat
                        ? isDark
                          ? 'bg-indigo-500/10 border-indigo-500/20'
                          : 'bg-indigo-50 border-indigo-100'
                        : isDark
                          ? 'bg-slate-800/50 border-slate-700'
                          : 'bg-slate-50 border-slate-200'
                        }`}
                      activeOpacity={0.7}
                    >
                      <Text
                        className={`text-sm font-medium ${category === cat
                          ? isDark
                            ? 'text-indigo-400'
                            : 'text-indigo-600'
                          : isDark
                            ? 'text-slate-400'
                            : 'text-slate-600'
                          }`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {categoryError && (
                  <AnimatedError
                    alert={categoryError}
                  />
                )}
              </View>
              {showCustomCategory && (
                <View className={`mt-3 flex-row items-center rounded-xl border px-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                    }`}>
                    <Feather
                      name="folder"
                      size={16}
                      color={isDark ? '#a78bfa' : '#8b5cf6'}
                    />
                  </View>
                  <TextInput
                    className={`flex-1 py-3 px-2 text-base ${isDark ? 'text-slate-50' : 'text-slate-900'}`}
                    placeholder="Enter custom category"
                    placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                    value={category === 'Custom' ? '' : category}
                    onChangeText={setCategory}
                  />
                </View>
              )}
            </Animated.View>
            <Animated.View
              layout={LinearTransition.damping(15)}
            >

              {/* Create Button */}
              <TouchableOpacity
                onPress={handleCreateTimer}
                className={`w-full py-4 rounded-xl ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'}`}
                style={{
                  shadowColor: isDark ? '#818cf8' : '#6366f1',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                }}
                activeOpacity={0.8}
              >
                <Text className="text-white text-center text-lg font-bold">
                  Create Timer
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}

export default CreateTimerSheet