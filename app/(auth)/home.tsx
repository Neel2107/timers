import { CompletionModal } from '@/components/timer/CompletionModal'
import CreateTimerSheet from '@/components/timer/CreateTimerSheet'
import TimerList from '@/components/timer/TimerList'
import { useTheme } from '@/context/ThemeContext'
import { useTimers } from '@/context/TimerContext'
import { Feather } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const HomeScreen = () => {
  const { isDark } = useTheme()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { showCompletionModal, setShowCompletionModal, completedTimerName, timers, updateRemainingTime } = useTimers()

  const timerIntervalsRef = useRef<{ [key: number]: NodeJS.Timeout }>({})
  const lastTicksRef = useRef<{ [key: number]: number }>({})

  useEffect(() => {
    // Create a separate interval for each running timer
    const runningTimers = timers.filter(timer => timer.status === 'running' && timer.remainingTime > 0)

    runningTimers.forEach(timer => {
      // Only create new interval if one doesn't exist
      if (!timerIntervalsRef.current[timer.id]) {
        lastTicksRef.current[timer.id] = Date.now()

        timerIntervalsRef.current[timer.id] = setInterval(() => {
          const now = Date.now()
          const lastTick = lastTicksRef.current[timer.id]
          const drift = now - lastTick
          const tickCount = Math.floor(drift / 1000)

          if (tickCount >= 1) {
            const newRemainingTime = Math.max(0, timer.remainingTime - tickCount)
            updateRemainingTime(timer.id, newRemainingTime)
            lastTicksRef.current[timer.id] = now - (drift % 1000)
          }
        }, 100)
      }
    })

    // Cleanup intervals for non-running timers
    Object.keys(timerIntervalsRef.current).forEach(timerId => {
      const id = parseInt(timerId)
      if (!runningTimers.find(t => t.id === id)) {
        clearInterval(timerIntervalsRef.current[id])
        delete timerIntervalsRef.current[id]
        delete lastTicksRef.current[id]
      }
    })

    return () => {
      // Cleanup all intervals on unmount
      Object.values(timerIntervalsRef.current).forEach(interval => clearInterval(interval))
      timerIntervalsRef.current = {}
      lastTicksRef.current = {}
    }
  }, [timers, updateRemainingTime])

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
        <Text className={`text-2xl  pt-4 font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
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