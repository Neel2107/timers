import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface NotificationToastProps {
    isVisible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const NotificationToast = ({ isVisible, title, message, type, onClose }: NotificationToastProps) => {
    const { isDark } = useTheme();
    const translateX = useSharedValue(0);
    const context = useSharedValue({ x: 0 });

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { x: translateX.value };
        })
        .onUpdate((event) => {
            translateX.value = event.translationX + context.value.x;
        })
        .onEnd(() => {
            const shouldDismiss = Math.abs(translateX.value) > 100;
            if (shouldDismiss) {
                translateX.value = withTiming(
                    translateX.value > 0 ? 400 : -400,
                    { duration: 200 },
                    () => {
                        runOnJS(onClose)();
                    }
                );
            } else {
                translateX.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    if (!isVisible) return null;

    return (
        <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            className="absolute bottom-2 left-4 right-4 z-50"
        >
            <GestureDetector gesture={gesture}>
                <Animated.View
                    entering={SlideInDown.springify().damping(15)}
                    style={[
                        animatedStyle,
                        {
                            shadowColor: isDark ? '#000' : '#64748b',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 5,
                        },
                    ]}
                    className={`flex-row items-center p-4 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'
                        }`}
                >
                    <View
                        className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${type === 'success'
                                ? isDark ? 'bg-green-900/30' : 'bg-green-100'
                                : isDark ? 'bg-red-900/30' : 'bg-red-100'
                            }`}
                    >
                        <Feather
                            name={type === 'success' ? 'check-circle' : 'alert-circle'}
                            size={20}
                            color={
                                type === 'success'
                                    ? isDark ? '#4ade80' : '#22c55e'
                                    : isDark ? '#f87171' : '#ef4444'
                            }
                        />
                    </View>
                    <View className="flex-1">
                        <Text className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                            {title}
                        </Text>
                        <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {message}
                        </Text>
                    </View>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
};

export default NotificationToast;