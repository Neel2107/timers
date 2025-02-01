import TimerList from '@/components/TimerList'
import { useTheme } from '@/context/ThemeContext'
import { useTimers } from '@/context/TimerContext'
import { Feather } from '@expo/vector-icons'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import * as Haptics from 'expo-haptics'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useMemo, useRef, useState } from 'react'
// Add Keyboard to imports
import { Alert, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const predefinedCategories = ['Workout', 'Study', 'Break', 'Meditation', 'Custom']

const HomeScreen = () => {
  const { isDark } = useTheme()
  const { addTimer } = useTimers()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [duration, setDuration] = useState('')
  const [category, setCategory] = useState('')
  const [showCustomCategory, setShowCustomCategory] = useState(false)

  const snapPoints = useMemo(() => ['90%'], [])


  const resetForm = () => {
    setName('')
    setDuration('')
    setCategory('')
    setShowCustomCategory(false)
  }

  const handleCloseSheet = useCallback(() => {
    Keyboard.dismiss() // Dismiss keyboard when sheet closes
    setIsOpen(false)
    bottomSheetRef.current?.close()
  }, [])

  const handleCreateTimer = useCallback(() => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a timer name')
      return
    }

    const durationNum = parseInt(duration)
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Error', 'Please enter a valid duration')
      return
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category')
      return
    }

    Keyboard.dismiss()
    addTimer({
      name: name.trim(),
      duration: durationNum,
      category: category.trim(),
    })

    resetForm()
    handleCloseSheet()
  }, [name, duration, category, addTimer])

  const handleOpenSheet = useCallback(() => {
    setIsOpen(true)
    bottomSheetRef.current?.expand()
  }, [])



  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  )

  const handleCategoryPress = useCallback((cat: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setCategory(cat)
    setShowCustomCategory(cat === 'Custom')
  }, [])

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="p-4 flex-1">
        <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
          My Timers
        </Text>

        <TimerList />

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={handleOpenSheet}
          className={`absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'
            }`}
          style={{
            shadowColor: isDark ? '#60a5fa' : '#3b82f6',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.4 : 0.2,
            shadowRadius: 12,
            elevation: 8,
          }}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={isOpen ? 0 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={handleCloseSheet}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: isDark ? '#4b5563' : '#9ca3af',
          width: 40,
          height: 4
        }}
        backgroundStyle={{
          backgroundColor: isDark ? '#1f2937' : '#ffffff'
        }}
      >
        <Animated.View
          entering={FadeIn.duration(300)}
          className="flex-1 px-6 pt-4"
        >
          <Text className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
            Create Timer
          </Text>
          <Text className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Set up your new timer details
          </Text>

          <View className="gap-5">
            {/* Timer Name Input */}
            <View>
              <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Timer Name
              </Text>
              <View className={`flex-row items-center rounded-xl border px-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                <Feather
                  name="clock"
                  size={18}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
                <TextInput
                  className={`flex-1 py-3 px-2 text-base ${isDark ? 'text-white' : 'text-black'}`}
                  placeholder="e.g., Morning Workout"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Duration Input */}
            <View>
              <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Duration
              </Text>
              <View className={`flex-row items-center rounded-xl border px-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <Feather
                  name="clock"
                  size={18}
                  color={isDark ? '#94a3b8' : '#64748b'}
                />
                <TextInput
                  className={`flex-1 py-3 px-2 text-base ${isDark ? 'text-slate-50' : 'text-slate-900'}`}
                  placeholder="Duration in seconds"
                  placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                  keyboardType="numeric"
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
            </View>

            {/* Category Selection */}
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
                        ? 'bg-indigo-900 border-indigo-800'
                        : 'bg-indigo-50 border-indigo-200'
                      : isDark
                        ? 'bg-slate-800 border-slate-700'
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
              {showCustomCategory && (
                <View className={`mt-3 flex-row items-center rounded-xl border px-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <Feather
                    name="tag"
                    size={18}
                    color={isDark ? '#94a3b8' : '#64748b'}
                  />
                  <TextInput
                    className={`flex-1 py-3 px-2 text-base ${isDark ? 'text-slate-50' : 'text-slate-900'}`}
                    placeholder="Enter custom category"
                    placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                    value={category === 'Custom' ? '' : category}
                    onChangeText={setCategory}
                  />
                </View>
              )}
            </View>

            {/* Create Button */}
            <TouchableOpacity
              onPress={handleCreateTimer}
              className={`w-full py-4 rounded-xl ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'}`}
              style={{
                shadowColor: isDark ? '#60a5fa' : '#3b82f6',
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


          </View>
        </Animated.View>
      </BottomSheet>
    </SafeAreaView>
  )
}

export default HomeScreen