import { Redirect } from 'expo-router'
import React from 'react'

const RootScreen = () => {
  return (
    <Redirect href={'/(auth)/home'} />
  )
}

export default RootScreen