import { useTheme } from '@/context/ThemeContext';
import { useTimers } from '@/context/TimerContext';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CategoryActionsProps {
    category: string;
    isExpanded: boolean;
}

export const CategoryActions = ({ category, isExpanded }: CategoryActionsProps) => {
    const { isDark } = useTheme();
    const { startCategoryTimers, pauseCategoryTimers, resetCategoryTimers } = useTimers();

    const handleAction = (action: 'start' | 'pause' | 'reset') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        switch (action) {
            case 'start':
                startCategoryTimers(category);
                break;
            case 'pause':
                pauseCategoryTimers(category);
                break;
            case 'reset':
                resetCategoryTimers(category);
                break;
        }
    };

    if (!isExpanded) return null;

    return (
        <Animated.View
            entering={FadeIn.duration(300)}
            className="flex-row gap-2 mt-2"
        >
            <TouchableOpacity
                onPress={() => handleAction('start')}
                className={`flex-1 flex-row items-center justify-center py-3 px-4 gap-1 rounded-xl border ${isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-slate-200'
                    }`}
                activeOpacity={0.7}
            >
                <Feather
                    name="play"
                    size={16}
                    color={isDark ? '#818cf8' : '#6366f1'}
                />
                <Text className={`ml-2 font-medium ${isDark ? 'text-slate-50' : 'text-slate-900'
                    }`}>
                    Start All
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleAction('pause')}
                className={`flex-1 flex-row items-center justify-center py-3 px-4 gap-1 rounded-xl border ${isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-slate-200'
                    }`}
                activeOpacity={0.7}
            >
                <Feather
                    name="pause"
                    size={16}
                    color={isDark ? '#818cf8' : '#6366f1'}
                />
                <Text className={`ml-2 font-medium ${isDark ? 'text-slate-50' : 'text-slate-900'
                    }`}>
                    Pause All
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleAction('reset')}
                className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl gap-1 border ${isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-slate-200'
                    }`}
                activeOpacity={0.7}
            >
                <Feather
                    name="refresh-ccw"
                    size={16}
                    color={isDark ? '#818cf8' : '#6366f1'}
                />
                <Text className={`ml-2 font-medium ${isDark ? 'text-slate-50' : 'text-slate-900'
                    }`}>
                    Reset All
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};