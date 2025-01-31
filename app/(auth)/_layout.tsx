import { Tabs } from 'expo-router'
import React from 'react'

const AuthLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="profileScreen" options={{ title: 'Profile' }} />
    </Tabs>
  )
}

export default AuthLayout