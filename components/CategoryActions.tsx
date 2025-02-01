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
            className="flex-row gap-2 mt-2 mb-3"
        >
            <TouchableOpacity
                onPress={() => handleAction('start')}
                className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-xl ${isDark ? 'bg-emerald-300/20 border-2 border-emerald-300/30' : 'bg-emerald-600/10 border-2 border-emerald-600/20'}`}
                activeOpacity={0.7}
            >
                <Feather
                    name="play"
                    size={16}
                    color={isDark ? '#6ee7b7' : '#059669'}
                />
                <Text className={`ml-2 font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    Start All
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleAction('pause')}
                className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-xl ${isDark ? 'bg-indigo-400/20 border-2 border-indigo-400/30' : 'bg-indigo-500/10 border-2 border-indigo-500/20'}`}
                activeOpacity={0.7}
            >
                <Feather
                    name="pause"
                    size={16}
                    color={isDark ? '#818cf8' : '#6366f1'}
                />
                <Text className={`ml-2 font-medium ${isDark ? 'text-indigo-500' : 'text-indigo-500'}`}>
                    Pause All
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleAction('reset')}
                className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-xl ${isDark ? 'bg-slate-800/50 border-2 border-slate-700' : 'bg-slate-100 border-2 border-slate-200'}`}
                activeOpacity={0.7}
            >
                <Feather
                    name="refresh-ccw"
                    size={16}
                    color={isDark ? '#94a3b8' : '#64748b'}
                />
                <Text className={`ml-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Reset All
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};