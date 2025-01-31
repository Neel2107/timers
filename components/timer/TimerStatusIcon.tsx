import { useTheme } from "@/context/ThemeContext"
import { Feather } from "@expo/vector-icons"
import { View } from "react-native"

interface TimerStatusIconProps {
    status: 'completed' | 'running' | 'idle'
}

export const TimerStatusIcon = ({ status }: TimerStatusIconProps) => {
    const { isDark } = useTheme()

    return (
        <View className={`w-16 h-16 rounded-2xl items-center justify-center ${
            status === 'completed'
                ? isDark ? 'bg-status-success-dark/15' : 'bg-status-success-light/15'
                : status === 'running'
                    ? isDark ? 'bg-brand-secondary-dark/15' : 'bg-brand-secondary/15'
                    : isDark ? 'bg-slate-800/50' : 'bg-slate-50'
        }`}>
            <Feather
                name={
                    status === 'completed'
                        ? 'check-circle'
                        : status === 'running'
                            ? 'activity'
                            : 'clock'
                }
                size={32}
                color={
                    status === 'completed'
                        ? isDark ? '#6ee7b7' : '#059669'
                        : status === 'running'
                            ? isDark ? '#818cf8' : '#6366f1'
                            : isDark ? '#94a3b8' : '#64748b'
                }
            />
        </View>
    )
}