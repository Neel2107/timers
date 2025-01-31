import { Redirect } from 'expo-router'
import React from 'react'

const NotFoundScreen = () => {
  return (
    <Redirect href={'/(auth)/home'} />
  )
}

export default NotFoundScreen