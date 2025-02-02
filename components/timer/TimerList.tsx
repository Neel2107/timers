import { predefinedCategories } from '@/constants/constants'
import { useTheme } from '@/context/ThemeContext'
import type { Timer } from '@/context/TimerContext'
import { Feather } from '@expo/vector-icons'
import React, { useCallback, useMemo, useState } from 'react'
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeInUp, FadeOut, LinearTransition } from 'react-native-reanimated'
import { useTimers } from '../../context/TimerContext'
import TimerCard from './TimerCard'
import TimerHeader from './TimerHeader'


const TimerList = () => {
  const { isDark } = useTheme()
  const { timers, loadTimers, startTimer, pauseTimer, resetTimer } = useTimers()
  const [refreshing, setRefreshing] = React.useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  // Add new state for selected category filter
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


  const handlePlayPause = useCallback((id: number) => {
    const timer = timers.find(t => t.id === id);
    if (timer?.status === 'running') {
      pauseTimer(id);
    } else {
      startTimer(id);
    }
  }, [timers, startTimer, pauseTimer]);



  // Group timers by category
  const groupedTimers = useMemo(() => {
    const groups: { [key: string]: Timer[] } = {}
    const filteredTimers = selectedCategory
      ? timers.filter(timer => timer.category === selectedCategory)
      : timers;

    filteredTimers.forEach(timer => {
      if (!groups[timer.category]) {
        groups[timer.category] = []
      }
      groups[timer.category].push(timer)
    })
    return groups
  }, [timers, selectedCategory])

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }, [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadTimers()
    setRefreshing(false)
  }, [loadTimers])


  const handleReset = useCallback((id: number) => {
    resetTimer(id);
  }, [resetTimer]);

  const getProgressPercentage = useCallback((timer: Timer) => {
    return Math.round((1 - timer.remainingTime / timer.duration) * 100);
  }, []);




  const EmptyComponent = useCallback(() => (
    <Animated.View
      entering={FadeIn.duration(500)}

      className="flex-1 justify-center items-center px-4"
    >
      <View className={`h-16 w-16 rounded-full  items-center justify-center ${isDark ? 'bg-slate-800 border border-slate-700  ' : 'bg-white border border-slate-200  '
        }`}>
        <Feather
          name="clock"
          size={32}
          color={isDark ? '#94a3b8' : '#64748b'}
        />
      </View>
      <Text className={`text-lg font-medium mt-4 ${isDark ? 'text-slate-50' : 'text-slate-900'
        }`}>
        No timers yet
      </Text>
      <Text className={`text-sm text-center mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
        Create your first timer by tapping the + button
      </Text>
    </Animated.View>
  ), [isDark])


  const renderCategory = useCallback(({ category, timers }: { category: string, timers: Timer[] }) => {
    const isExpanded = expandedCategories.includes(category);
    return (
      <Animated.View
        entering={FadeInUp.duration(100).springify().damping(14)}
        exiting={FadeOut.duration(100)}
        layout={LinearTransition.springify().damping(14).mass(0.4)}

        className={` p-4 rounded-2xl border gap-5 ${isDark
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
          }`}
      >
        <View >
          <TimerHeader
            category={category}
            count={timers.length}
            isExpanded={isExpanded}
            onToggle={() => toggleCategory(category)}
          />
        </View>

        {isExpanded && (
          <Animated.View
            entering={FadeInUp.duration(200).springify().damping(14)}
            exiting={FadeOut.duration(200)}
            className="mt-2 gap-5 px-1"
          >
            {timers.map((timer, index) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                index={index}
                onPlayPause={handlePlayPause}
                onReset={handleReset}
                progressPercentage={getProgressPercentage(timer)}
              />
            ))}
          </Animated.View>
        )}
      </Animated.View>
    );
  }, [expandedCategories, handlePlayPause, handleReset, getProgressPercentage, isDark]);

  return (
    <>
      <View>

        <Animated.View
          entering={FadeIn.duration(300)}
          className="mb-4"
        >


          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4, gap: 8 }}
          >
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              className={`flex-row items-center px-4 py-2.5 rounded-xl border ${selectedCategory === null
                ? isDark
                  ? 'bg-indigo-500/10 border-indigo-500/20'
                  : 'bg-indigo-50 border-indigo-100'
                : isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-slate-200'
                }`}
            >
              <Feather
                name="layers"
                size={16}
                color={selectedCategory === null
                  ? isDark ? '#818cf8' : '#6366f1'
                  : isDark ? '#94a3b8' : '#64748b'
                }
              />
              <Text
                className={`text-sm font-medium ml-2 ${selectedCategory === null
                  ? isDark
                    ? 'text-indigo-400'
                    : 'text-indigo-600'
                  : isDark
                    ? 'text-slate-400'
                    : 'text-slate-600'
                  }`}
              >
                All Categories
              </Text>
            </TouchableOpacity>

            {predefinedCategories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`flex-row items-center px-4 py-2.5 rounded-xl border ${selectedCategory === category
                  ? isDark
                    ? 'bg-indigo-500/10 border-indigo-500/20'
                    : 'bg-indigo-50 border-indigo-100'
                  : isDark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-200'
                  }`}
              >
                <Feather
                  name={category === 'Work' ? 'briefcase'
                    : category === 'Study' ? 'book'
                      : category === 'Workout' ? 'activity'
                        : category === 'Break' ? 'coffee'
                          : category === 'Custom' ? 'tag'
                            : 'folder'}
                  size={16}
                  color={selectedCategory === category
                    ? isDark ? '#818cf8' : '#6366f1'
                    : isDark ? '#94a3b8' : '#64748b'
                  }
                />
                <Text
                  className={`text-sm font-medium ml-2 ${selectedCategory === category
                    ? isDark
                      ? 'text-indigo-400'
                      : 'text-indigo-600'
                    : isDark
                      ? 'text-slate-400'
                      : 'text-slate-600'
                    }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

      </View>
      <Animated.FlatList
        itemLayoutAnimation={LinearTransition.damping(14)}
        data={Object.entries(groupedTimers)}
        renderItem={({ item: [category, categoryTimers] }) =>
          renderCategory({ category, timers: categoryTimers })}
        keyExtractor={([category]) => category}
        contentContainerStyle={[
          {
            flexGrow: 1,
            paddingBottom: 100,
            paddingHorizontal: 4,
            gap: 10
          },
          timers.length === 0 && { flex: 1 }
        ]}
        ListEmptyComponent={EmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#94a3b8' : '#64748b'}
            colors={[isDark ? '#94a3b8' : '#64748b']}
            progressBackgroundColor={isDark ? '#1e293b' : '#f8fafc'}
          />
        }
        showsVerticalScrollIndicator={false}
        windowSize={5}
        maxToRenderPerBatch={5}
        initialNumToRender={4}
        removeClippedSubviews={true}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={true}
      />
    </>
  )
}

export default TimerList