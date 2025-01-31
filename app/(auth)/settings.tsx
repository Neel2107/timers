import React from 'react'
import { Text, View } from 'react-native'
import { Switch } from 'react-native-gesture-handler'


const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center p-4 bg-gray-50 rounded-lg">
        <Text className="text-base font-medium">Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
        />
      </View>
    </View>
  )
}

export default SettingsScreen