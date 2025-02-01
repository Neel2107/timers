import { useTheme } from '@/context/ThemeContext';
import { TimerAlert } from '@/context/TimerContext';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import AnimatedError from '@components/Error/AnimatedError';

interface AlertSectionProps {
    alerts: TimerAlert[];
    onAddAlert: (percentage: number) => void;
    onRemoveAlert: (index: number) => void;
}

const PRESET_ALERTS = [25, 50, 75, 80];


const AnimatedFeather = Animated.createAnimatedComponent(Feather)

const MAX_ALERTS = 5;

export const AlertSection = ({ alerts, onAddAlert, onRemoveAlert }: AlertSectionProps) => {
    const { isDark } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const [alertPercentage, setAlertPercentage] = useState('');
    const [alertError, setAlertError] = useState('');
    const rotateZ = useSharedValue(0)

    const handleAddAlert = () => {
        const percentage = parseInt(alertPercentage);

        // Add max alerts validation
        if (alerts.length >= MAX_ALERTS) {
            setAlertError(`Maximum ${MAX_ALERTS} alerts allowed`);
            return;
        }

        // Validate the input
        if (!alertPercentage) {
            setAlertError('Please enter a percentage');
            return;
        }

        if (isNaN(percentage)) {
            setAlertError('Please enter a valid number');
            return;
        }

        if (percentage <= 0 || percentage >= 100) {
            setAlertError('Percentage must be between 1 and 99');
            return;
        }

        if (alerts.some(alert => alert.percentage === percentage)) {
            setAlertError('This percentage alert already exists');
            return;
        }

        // Clear error and add alert
        setAlertError('');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onAddAlert(percentage);
        setAlertPercentage('');
    };
    useEffect(() => {
        rotateZ.value = withSpring(isExpanded ? 180 : 0, {
            damping: 15,
            stiffness: 100
        })
    }, [isExpanded])
    const rotation = useDerivedValue(() => `${rotateZ.value}deg`)

    const chevronStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: rotation.value }]
    }))

    const toggleExpand = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsExpanded(!isExpanded);
    };

    return (
        <Animated.View layout={LinearTransition.springify().damping(15)} className={`flex-col gap-5 p-4 rounded-xl border mb-2
        ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <TouchableOpacity
                onPress={toggleExpand}
                className={`flex-row items-center justify-between
        `}
                activeOpacity={0.8}
            >
                <View className="flex-row items-center gap-3">
                    <View className={`w-8 h-8 rounded-full items-center justify-center 
            ${isDark ? 'bg-orange-900/30' : 'bg-orange-100'}`}
                    >
                        <Feather
                            name="bell"
                            size={16}
                            color={isDark ? '#fb923c' : '#f97316'}
                        />
                    </View>
                    <View>
                        <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            Progress Alerts
                        </Text>
                        <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {alerts.length ? `${alerts.length} alert${alerts.length > 1 ? 's' : ''}` : 'Optional'}
                        </Text>
                    </View>
                </View>
                <AnimatedFeather
                    name="chevron-down"
                    size={20}
                    color={isDark ? '#94a3b8' : '#64748b'}
                    style={chevronStyle}
                />
            </TouchableOpacity>

            {isExpanded && (
                <Animated.View
                    entering={FadeIn.duration(200).delay(100)}
                    exiting={FadeOut.duration(200)}
                    className="gap-2"
                >

                    <View className="flex-row flex-wrap gap-2 mb-4">
                        {PRESET_ALERTS.map((preset) => (
                            <TouchableOpacity
                                key={preset}
                                onPress={() => {
                                    if (alerts.length >= MAX_ALERTS) {
                                        setAlertError(`Maximum ${MAX_ALERTS} alerts allowed`);
                                        return;
                                    }
                                    if (!alerts.some(a => a.percentage === preset)) {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        onAddAlert(preset);
                                    }
                                }}
                                className={`px-4 py-2 rounded-full border
                                    ${alerts.some(a => a.percentage === preset)
                                        ? isDark
                                            ? 'bg-indigo-500/10 border-indigo-500/20'
                                            : 'bg-indigo-50 border-indigo-100'
                                        : isDark
                                            ? 'bg-slate-800/50 border-slate-700'
                                            : 'bg-slate-50 border-slate-200'
                                    }`}
                                activeOpacity={0.7}
                            >
                                <Text className={`text-sm font-medium
                                    ${alerts.some(a => a.percentage === preset)
                                        ? isDark ? 'text-indigo-400' : 'text-indigo-600'
                                        : isDark ? 'text-slate-400' : 'text-slate-600'
                                    }`}
                                >
                                    {preset}%
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View className="flex-row items-center gap-2">

                        <View className={`flex-1 flex-row items-center rounded-xl border px-4 
              ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                        >
                            <TextInput
                                className={`flex-1 py-3 text-base ${isDark ? 'text-slate-50' : 'text-slate-900'}`}
                                placeholder="Enter percentage (1-99)"
                                placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                                value={alertPercentage}
                                onChangeText={setAlertPercentage}
                                keyboardType="numeric"
                                maxLength={2}
                            />
                            <Text className={`text-base 
                                ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>%</Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleAddAlert}
                            className={`px-4 py-3 rounded-xl 
                                ${isDark ? 'bg-indigo-600/40' : 'bg-indigo-500'}
                                `}
                        >
                            <Feather name="plus" size={20} color="white" />
                        </TouchableOpacity>
                    </View>


                    {alertError && (
                        <AnimatedError
                            alert={alertError}
                        />
                    )}


                    {alerts.length > 0 && (
                        <Animated.View
                            layout={LinearTransition.damping(15)}
                            className={`flex-row flex-wrap gap-2 p-2`}
                        >
                            {alerts.sort((a, b) => a.percentage - b.percentage).map((alert, index) => (
                                <Animated.View
                                    key={index}
                                    entering={FadeIn.delay(80 * index).duration(200)}
                                    exiting={FadeOut}
                                    layout={LinearTransition.damping(15)}
                                    className={`flex-row items-center gap-3 px-3 py-2 rounded-full border
                                        ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}
                                >
                                    <Text className={`text-sm font-medium
                                        ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
                                    >
                                        {alert.percentage}%
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            onRemoveAlert(index);
                                        }}
                                        hitSlop={8}
                                    >
                                        <Feather
                                            name="x"
                                            size={14}
                                            color={isDark ? '#818cf8' : '#6366f1'}
                                        />
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </Animated.View>
                    )}
                </Animated.View>
            )}
        </Animated.View>
    );
};