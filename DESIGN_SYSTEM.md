  # HabitMates Design System
 
  ## Color Palette
 
  ### Brand Colors
  ```css
  Primary:
  - Light Mode: #059669 (Emerald-600)
  - Dark Mode: #6ee7b7 (Emerald-300)
 
  Secondary:
  - Light Mode: #6366f1 (Indigo-500)
  - Dark Mode: #818cf8 (Indigo-300)
  ```
 
  ### App Background
  ```css
  Light Mode: #f8fafc (Slate-50)
  Dark Mode: #0f172a (Slate-900)
  ```
 
  ### Card Colors
  ```css
  Light Mode: #ffffff (White)
  Dark Mode: #1e293b (Slate-800)
  ```
 
  ### Content Colors
  ```css
  Primary Text:
  - Light Mode: #1e293b (Slate-800)
  - Dark Mode: #ffffff (White)
 
  Secondary Text:
  - Light Mode: #64748b (Slate-500)
  - Dark Mode: #94a3b8 (Slate-400)
 
  Tertiary Text:
  - Light Mode: #94a3b8 (Slate-400)
  - Dark Mode: #64748b (Slate-500)
  ```
 
  ### Border Colors
  ```css
  Light Mode: #e2e8f0 (Slate-200)
  Dark Mode: #334155 (Slate-700)
  ```
 
  ### Status Colors
  ```css
  Success:
  - Light Mode: #34d399 (Emerald-400)
  - Dark Mode: #6ee7b7 (Emerald-300)
 
  Error:
  - Light Mode: #ef4444 (Red-500)
  - Dark Mode: #f87171 (Red-400)
 
  Warning:
  - Light Mode: #f59e0b (Amber-500)
  - Dark Mode: #fbbf24 (Amber-400)
  ```
 
  ### Feature Colors
  ```css
  Notification:
  - Light Mode: #8b5cf6 (Violet-500)
  - Dark Mode: #a78bfa (Violet-400)
 
  Achievement:
  - Light Mode: #f59e0b (Amber-500)
  - Dark Mode: #fbbf24 (Amber-400)
  ```
 
  ## Component Styling
 
  ### Cards
  ```css
  Base Card:
  - Rounded corners: rounded-2xl
  - Border: border
  - Background: bg-app-card-light/dark
  - Border color: border-border-light/dark
  - Padding: p-4
  ```
 
  ### Buttons
  ```css
  Primary Button:
  - Background: bg-brand-primary/primary-dark
  - Text color: text-white
  - Padding: py-4 px-6
  - Border radius: rounded-xl
  - Font weight: font-semibold
 
  Secondary Button:
  - Background: transparent
  - Border: border-2 border-brand-primary/primary-dark
  - Text color: text-brand-primary/primary-dark
  - Padding: py-4 px-6
  - Border radius: rounded-xl
  - Font weight: font-semibold
  ```
 
  ### Text Inputs
  ```css
  Base Input:
  - Background: transparent
  - Text color: text-content-primary-light/dark
  - Placeholder color: text-content-secondary-light/dark
  - Font size: text-base
  - Padding: p-4
  - Border radius: rounded-xl
  - Border: border border-border-light/dark
  ```
 
  ### Navigation
  ```css
  Tab Bar:
  - Background: bg-app-card-light/dark
  - Active tint: brand-primary/primary-dark
  - Inactive tint: content-secondary-light/dark
  - Height: 65px
  - Padding: pt-8 pb-8
  - Border top: border-t border-border-light/dark
  ```
 
  ### Icons
  ```css
  Default size: 24px
  Colors:
  - Primary: brand-primary/primary-dark
  - Secondary: content-secondary-light/dark
  ```
 
  ## Typography
 
  ```css
  Headings:
  - H1: text-2xl font-bold
  - H2: text-xl font-semibold
  - H3: text-lg font-semibold
 
  Body:
  - Regular: text-base
  - Small: text-sm
  - Tiny: text-xs
 
  Font weights:
  - Regular: font-normal
  - Medium: font-medium
  - Semibold: font-semibold
  - Bold: font-bold
  ```
 
  ## Animation Presets
 
  ```typescript
    Fade In
  FadeIn.duration(500)
 
    Fade In Down
  FadeInDown.duration(500).delay(200)
 
    Layout Animation
  Layout.springify()
  ```
 
  ## Dark Mode Implementation
 
  ```typescript
    Theme Store Structure
  interface ThemeState {
    mode: 'system' | 'light' | 'dark';
    isDark: boolean;
  }
 
    Component Usage
  const isDark = useThemeStore((state) => state.isDark);
 
    Conditional Styling
  className={`bg-app-${isDark ? 'dark' : 'light'}`}
  ```
 
  ## Common Layout Patterns
 
  ```css
  Safe Area Container:
  - flex-1
  - bg-app-light/dark
 
  Card Container:
  - rounded-2xl
  - border
  - bg-app-card-light/dark
  - border-border-light/dark
  - p-4
 
  Form Group:
  - gap-4
  - mb-6
 
  Input Group:
  - flex-row
  - items-center
  - gap-3
  ```