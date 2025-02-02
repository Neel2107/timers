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

### Screen Recordings  

[![Embedded screen recording here, showcasing the working app.]](https://github.com/user-attachments/assets/6bb5f9f5-e3f7-40b3-928e-2026395681ac)  

[![Embedded screen recording here, showcasing the working app.]](https://github.com/user-attachments/assets/ace2ac06-9b99-4754-9c8c-2b99763c7719)  

[![Embedded screen recording here, showcasing the working app.]](https://github.com/user-attachments/assets/15b4d7f7-797d-4cd4-8889-c6ac22bd3c20)  

[![Embedded screen recording here, showcasing the working app.]](https://github.com/user-attachments/assets/37d1e6b4-17ff-4df3-87ed-8215696555c5)  

### Screenshots 

<div style="display:flex;">
  <img src="https://github.com/user-attachments/assets/0994c782-509b-4bf9-967f-cc4a77445b02" alt="Image 1" style="height:300px; margin-right:10px;">
  <img src="https://github.com/user-attachments/assets/f0974ba9-200a-4c39-8da4-c659cf62215b" alt="Image 2" style="height:300px; margin-right:10px;">
  <img src="https://github.com/user-attachments/assets/9172b8ae-5f03-4c39-ac62-d6967524d872" alt="Image 3" style="height:300px;">
</div>

<div style="display:flex;">
  <img src="https://github.com/user-attachments/assets/e65af401-efd4-4749-be8a-bf9a15698168" alt="Image 4" style="height:300px; margin-right:10px;">
  <img src="https://github.com/user-attachments/assets/3a1dbd6b-d083-429d-8d95-17fd7601888e" alt="Image 5" style="height:300px; margin-right:10px;">
  <img src="https://github.com/user-attachments/assets/ae188425-c6f5-4173-a36b-b440b66b5f2a" alt="Image 6" style="height:300px;">
</div>

<div style="display:flex;">
  <img src="https://github.com/user-attachments/assets/67f581ad-449a-4072-aabc-cc3c50b303ae" alt="Image 7" style="height:300px;">
</div>



  
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
  
