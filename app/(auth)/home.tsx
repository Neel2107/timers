import CreateTimerSheet from '@/components/CreateTimerSheet'
import TimerList from '@/components/TimerList'
import { Ionicons } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import React, { useCallback, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOpenSheet = useCallback(() => {
    setIsOpen(true)
    bottomSheetRef.current?.expand()
  }, [])

  const handleCloseSheet = useCallback(() => {
    setIsOpen(false)
    bottomSheetRef.current?.close()
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold">My Timers</Text>
        <TouchableOpacity
          className="bg-blue-500 rounded-full p-3"
          onPress={handleOpenSheet}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <TimerList />

      <CreateTimerSheet
        bottomSheetRef={bottomSheetRef}
        isOpen={isOpen}
        onClose={handleCloseSheet}
      />
    </SafeAreaView>
  )
}

export default HomeScreen