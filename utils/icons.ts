import { Feather, Ionicons } from '@expo/vector-icons'

type IconFamily = {
  [key: string]: {
    family: typeof Feather | typeof Ionicons
    name: string
    darkColor: string
    lightColor: string
    darkBgColor: string
    lightBgColor: string
  }
}

export const ICONS: IconFamily = {
  github: {
    family: Feather,
    name: 'github',
    darkColor: '#94a3b8',
    lightColor: '#64748b',
    darkBgColor: 'bg-slate-900/30',
    lightBgColor: 'bg-slate-100'
  },
  linkedin: {
    family: Feather,
    name: 'linkedin',
    darkColor: '#60a5fa',
    lightColor: '#3b82f6',
    darkBgColor: 'bg-blue-900/30',
    lightBgColor: 'bg-blue-100'
  },
  portfolio: {
    family: Feather,
    name: 'globe',
    darkColor: '#a78bfa',
    lightColor: '#8b5cf6',
    darkBgColor: 'bg-purple-900/30',
    lightBgColor: 'bg-purple-100'
  },
  resume: {
    family: Feather,
    name: 'file-text',
    darkColor: '#4ade80',
    lightColor: '#22c55e',
    darkBgColor: 'bg-green-900/30',
    lightBgColor: 'bg-green-100'
  },
  theme: {
    family: Ionicons,
    name: 'color-palette-outline',
    darkColor: '#818cf8',
    lightColor: '#6366f1',
    darkBgColor: 'bg-indigo-900/30',
    lightBgColor: 'bg-indigo-100'
  },
  export: {
    family: Ionicons,
    name: 'download-outline',
    darkColor: '#60a5fa',
    lightColor: '#3b82f6',
    darkBgColor: 'bg-blue-900/30',
    lightBgColor: 'bg-blue-100'
  },
  externalLink: {
    family: Feather,
    name: 'external-link',
    darkColor: '#94a3b8',
    lightColor: '#64748b',
    darkBgColor: '',
    lightBgColor: ''
  }
}

export const getIcon = (iconKey: keyof typeof ICONS, size: number, isDark: boolean) => {
  const icon = ICONS[iconKey]
  const IconComponent = icon.family
  return {
    IconComponent,
    name: icon.name,
    color: isDark ? icon.darkColor : icon.lightColor,
    bgColor: isDark ? icon.darkBgColor : icon.lightBgColor,
    size
  }
}