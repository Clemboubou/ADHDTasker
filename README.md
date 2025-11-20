# ADHD Task Manager

A powerful mobile task management application designed specifically for people with ADHD. Built with React Native and TypeScript for Android.

## Features

### Core Task Management
- Create, edit, and delete tasks with rich details
- Time estimation for each task
- Customizable categories and tags
- Priority levels (high, medium, low) with visual indicators
- Task status tracking (to-do, in progress, completed)
- Photo attachments for tasks

### Pomodoro Timer
- Integrated 25/5 Pomodoro timer (customizable)
- Sound and visual notifications
- Track Pomodoros per task
- Long breaks after 4 Pomodoros
- Background timer support

### Gamification System
- XP/Level progression system
- Points based on task difficulty and time
- Daily streak tracking
- Bonus rewards for urgent tasks and streaks
- Level titles and achievements

### Views
- **Today Focus**: Streamlined view of 3-5 priority tasks
- **Task List**: Full task list with advanced filters
- **Calendar**: Monthly, weekly, and daily views
- **History**: Complete task history with statistics
- **Templates**: Reusable task routines

### Smart Features
- Task chains (auto-progression through sequences)
- Recurring tasks
- Smart notifications
- Export/Import data (JSON backup)
- Comprehensive statistics and analytics

## Tech Stack

- **Framework**: React Native 0.82
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Database**: SQLite (react-native-sqlite-storage)
- **Storage**: AsyncStorage
- **UI Libraries**:
  - react-native-calendars
  - react-native-chart-kit
  - react-native-vector-icons
  - react-native-reanimated
- **Utilities**: date-fns, uuid

## Installation

### Prerequisites
- Node.js >= 20
- Android SDK
- React Native development environment setup

### Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ADHDTasker.git
cd ADHDTasker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. For Android, install additional dependencies:
```bash
cd android
./gradlew clean
cd ..
```

4. Link native dependencies (if needed):
```bash
npx react-native link react-native-vector-icons
npx react-native link react-native-sqlite-storage
```

## Running the App

### Development Mode

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android
```

### Building APK

#### Debug APK
```bash
cd android
./gradlew assembleDebug
```

The APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

#### Release APK

1. Generate a signing key (first time only):
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore adhd-tasker-release.keystore -alias adhd-tasker -keyalg RSA -keysize 2048 -validity 10000
```

2. Place the keystore file in `android/app/`

3. Create `android/gradle.properties` with:
```properties
MYAPP_RELEASE_STORE_FILE=adhd-tasker-release.keystore
MYAPP_RELEASE_KEY_ALIAS=adhd-tasker
MYAPP_RELEASE_STORE_PASSWORD=your_store_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

4. Update `android/app/build.gradle` with signing config:
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

5. Build release APK:
```bash
cd android
./gradlew assembleRelease
```

The signed APK will be at:
`android/app/build/outputs/apk/release/app-release.apk`

## Project Structure

```
ADHDTasker/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Task/
│   │   ├── Pomodoro/
│   │   ├── Gamification/
│   │   ├── Templates/
│   │   └── Common/
│   ├── screens/          # Main app screens
│   ├── navigation/       # Navigation configuration
│   ├── contexts/         # React Context providers
│   ├── services/         # Database, storage, notifications
│   ├── utils/            # Utility functions and constants
│   └── types/            # TypeScript type definitions
├── android/              # Android native code
├── ios/                  # iOS native code (future)
└── App.tsx               # Root component
```

## Usage Guide

### Creating a Task
1. Tap the "+" button
2. Enter task details (title, description, time estimate)
3. Select category and priority
4. Optionally add photos
5. Save

### Using Pomodoro Timer
1. Open a task
2. Tap "Start Pomodoro"
3. Focus for 25 minutes
4. Take a 5-minute break
5. Repeat

### Today Focus
- Automatically selects 3-5 priority tasks
- Based on urgency, priority, and recurring patterns
- Customize manually if needed

### Creating Templates
1. Go to Templates screen
2. Create new template
3. Add tasks to the template
4. Save for future use
5. Instantiate template to create all tasks at once

### Viewing Statistics
- Go to Stats screen
- View completion rates, XP earned, time spent
- Filter by date range or category
- Export data as JSON

## Configuration

### Pomodoro Settings
Navigate to Settings to customize:
- Focus duration (default: 25 min)
- Short break (default: 5 min)
- Long break (default: 15 min)
- Pomodoros until long break (default: 4)

### Notifications
- Enable/disable notifications
- Set daily motivation time
- Configure streak reminders
- Sound settings

### XP System
- Base XP: 10 per task
- Time bonus: 2 XP per minute estimated
- Priority multipliers: Low (1x), Medium (1.5x), High (2x)
- Urgent task bonus: +50 XP
- Streak bonus: +10% per day

## Data Management

### Backup
- Tap "Export Data" in Settings
- Saves all tasks, templates, and stats as JSON
- Store backup file safely

### Restore
- Tap "Import Data" in Settings
- Select backup JSON file
- All data will be restored

### Reset
- Clear all data from Settings
- Warning: This cannot be undone!

## Troubleshooting

### App won't start
```bash
# Clear cache
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
```

### Database issues
- Clear app data from Android settings
- Reinstall the app

### Notification not working
- Check Android notification permissions
- Ensure battery optimization is disabled for the app

## Development Status

### Completed
- [x] Project setup with TypeScript
- [x] Database structure (SQLite)
- [x] Storage utilities (AsyncStorage)
- [x] Type definitions
- [x] Constants and utilities
- [x] XP calculation system
- [x] Date helpers

### In Progress
- [ ] Task Context and CRUD operations
- [ ] UI Components
- [ ] Navigation setup
- [ ] Screen implementations

### Planned
- [ ] Pomodoro timer
- [ ] Notifications
- [ ] Gamification UI
- [ ] Calendar view
- [ ] Templates
- [ ] Export/Import
- [ ] Statistics and charts

## Contributing

This is a personal project, but suggestions and bug reports are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Acknowledgments

Built with React Native and love for productivity.

## Contact

For questions or feedback, open an issue on GitHub.

---

**Note**: This app is designed for personal use and optimized for Android devices, specifically tested on Vivo X80 Pro.
