import CreateTimerSheet from '@/components/CreateTimerSheet'
import { CompletionModal } from '@/components/timer/CompletionModal'
import TimerList from '@/components/timer/TimerList'
import { useTheme } from '@/context/ThemeContext'
import { useTimers } from '@/context/TimerContext'
import { Feather } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useRef, useState } from 'react'
import { Keyboard, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const HomeScreen = () => {
  const { isDark } = useTheme()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { showCompletionModal, setShowCompletionModal, completedTimerName } = useTimers()


  const handleCloseSheet = useCallback(() => {
    Keyboard.dismiss() // Dismiss keyboard when sheet closes
    setIsOpen(false)
    bottomSheetRef.current?.close()
  }, [])

  const handleOpenSheet = useCallback(() => {
    setIsOpen(true)
    bottomSheetRef.current?.expand()
  }, [])


  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>

      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="px-4 flex-1">
        <Text className={`text-2xl  pt-4 font-bold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
          My Timers
        </Text>

        <TimerList />

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={handleOpenSheet}
          className={`absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'
            }`}
          style={{
            shadowColor: isDark ? '#6a62fc' : '#4f46e5',
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
      <View>

        <CompletionModal
          isVisible={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          timerName={completedTimerName}
        />
      </View>
      <CreateTimerSheet
        bottomSheetRef={bottomSheetRef}
        isOpen={isOpen}
        onClose={handleCloseSheet}

      />


    </SafeAreaView>
  )
}

export default HomeScreen