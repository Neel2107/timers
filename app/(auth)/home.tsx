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
      <Animated.View
        entering={FadeIn.duration(500)}
        className="px-4 pt-4 pb-6 flex-1"
      >
        <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
          My Timers
        </Text>

        <TimerList />

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={handleOpenSheet}
          className={`absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center ${
            isDark ? 'bg-indigo-500' : 'bg-indigo-500'
          }`}
          style={{
            shadowColor: isDark ? '#6366f1' : '#4f46e5',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.6 : 0.15,
            shadowRadius: 16,
            elevation: 12,
          }}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <BottomSheet
        ref={bottomSheetRef}
        index={isOpen ? 0 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={handleCloseSheet}
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
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
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
            {/* Timer Name Input */}
            <View>
              <Text className={`text-base font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Timer Name
              </Text>
              <View className={`flex-row items-center rounded-xl border px-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <Feather
                  name="clock"
                  size={18}
                  color={isDark ? '#94a3b8' : '#64748b'}
                />
                <TextInput
                  className={`flex-1 py-3 px-2 text-base ${isDark ? 'text-slate-50' : 'text-slate-900'}`}
                  placeholder="e.g., Morning Workout"
                  placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
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
              className={`w-full py-4 rounded-xl shadow-lg ${isDark ? 'bg-indigo-500' : 'bg-indigo-500'}`}
              style={{
                shadowColor: '#6366f1',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
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