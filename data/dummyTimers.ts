import type { Timer } from '@/context/TimerContext'

export const dummyTimers: Timer[] = [
  {
    id: 1,
    name: 'Morning Workout',
    duration: 1800, // 30 minutes
    category: 'Exercise',
    status: 'paused',
    remainingTime: 1800,
  },
  {
    id: 2,
    name: 'Meditation',
    duration: 600, // 10 minutes
    category: 'Wellness',
    status: 'running',
    remainingTime: 450,
  },
  {
    id: 3,
    name: 'Study Session',
    duration: 3600, // 1 hour
    category: 'Study',
    status: 'completed',
    remainingTime: 0,
  },
  {
    id: 4,
    name: 'Coffee Break',
    duration: 900, // 15 minutes
    category: 'Break',
    status: 'paused',
    remainingTime: 600,
  },
  {
    id: 5,
    name: 'Reading Time',
    duration: 1200, // 20 minutes
    category: 'Personal',
    status: 'running',
    remainingTime: 800,
  }
]

// Example usage in a test component:
/*
import { dummyTimers } from '@/data/dummyTimers'

const TestComponent = () => {
  return (
    <View>
      {dummyTimers.map((timer, index) => (
        <TimerCard
          key={timer.id}
          timer={timer}
          index={index}
        />
      ))}
    </View>
  )
}
*/