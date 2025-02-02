import { useTheme } from '@/context/ThemeContext';
import { Timer } from '@/context/TimerContext';
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

interface ToastAlertProps {
    isVisible: boolean;
    timer: Timer;
    percentage: number;
    onClose: () => void;
}

const ToastAlert = ({ isVisible, timer, percentage, onClose }: ToastAlertProps) => {
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
            className="absolute bottom-20 left-4 right-4 z-50"
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
                        } shadow-lg`}
                >
                    <View
                        className={`w-10 h-10 rounded-xl items-center justify-center mr-3
              ${isDark ? 'bg-orange-900/30' : 'bg-orange-100'}`}
                    >
                        <Feather
                            name="bell"
                            size={20}
                            color={isDark ? '#fb923c' : '#f97316'}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                            {timer.name}
                        </Text>
                        <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {percentage}% complete
                        </Text>
                    </View>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
};

export default ToastAlert;