  # Timer Management App
  
  A React Native application for managing multiple customizable timers with categories, progress tracking, and history management.
  
  ## Features
  
  ### Core Features
  - Create and manage multiple timers
  - Categorize timers with custom categories
  - Timer controls (Start, Pause, Reset)
  - Visual progress tracking
  - Category-based grouping with expandable sections
  - Bulk actions for category-based timer management
  
  ### Enhanced Features
  - Timer completion history
  - Customizable alerts at specific percentages
  - Dark/Light theme support
  - Category filtering
  - Timer data persistence
  - Completion notifications with haptic feedback
  
  ## Known Issues
  - Multiple timers running concurrently may experience slight timing inconsistencies
  - Timer synchronization needs improvement when running multiple timers simultaneously
  
  ## Technical Stack
  
  ### Core Technologies
  - React Native with Expo
  - TypeScript
  - NativeWind (TailwindCSS for React Native)
  
  ### Key Packages
  - @react-native-async-storage/async-storage
  - @gorhom/bottom-sheet
  - expo-haptics
  - react-native-reanimated
  - lottie-react-native
  
  ## Setup Instructions
  
  1. Clone the repository:
  ```bash
  git clone https://github.com/Neel2107/timers
  cd timers
  ```
  
  2. Install dependencies:
  ```bash
  npm install
  ```
  
  3. Start the development server:
  ```bash
  npx expo start
  ```
  
  4. Run on your device or simulator:
  - Press 'i' for iOS simulator
  - Press 'a' for Android emulator
  
  ## Development Assumptions
  
  1. Timer Management:
     - Timers continue running in the background
     - Multiple timers can run simultaneously
     - Timer state persists across app restarts
  
  2. User Interface:
     - Support for both light and dark themes
     - Haptic feedback for important actions
  
  3. Data Management:
     - Local storage using AsyncStorage
     - No backend/server requirements
     - Timer history is stored locally
  
  
  ## Future Improvements
  
  1. Timer Synchronization:
     - Improve accuracy for concurrent timers
     - Better handling of background execution
  
  2. Data Management:
     - Cloud backup support
  
  3. User Experience:
     - Add timer templates
     - Custom sound notifications
     - More customization options for alerts
  
  ## License
  
  MIT License