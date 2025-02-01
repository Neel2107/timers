import { predefinedCategories } from '@/constants/categories'
import { useTheme } from '@/context/ThemeContext'
import { Feather } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, { FadeIn } from 'react-native-reanimated'

interface FilterHeaderProps {
    selectedCategory: string | null
    onSelectCategory: (category: string | null) => void
}

const FilterHeader = ({ selectedCategory, onSelectCategory }: FilterHeaderProps) => {
    const { isDark } = useTheme()

    return (

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
                    onPress={() => onSelectCategory(null)}
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
                        onPress={() => onSelectCategory(category)}
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

    )
}

export default FilterHeader