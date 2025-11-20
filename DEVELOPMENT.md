# ADHD Task Manager - Development Guide

## Current Status

### ✅ Completed (Phase 1 & 2)

#### Phase 1: Setup & Core
- [x] React Native project initialized with TypeScript
- [x] All dependencies installed
- [x] Project folder structure created
- [x] TypeScript types defined (Task, Template, UserStats, etc.)
- [x] Constants and utilities created
- [x] XP calculation system implemented
- [x] Date helpers implemented
- [x] SQLite database service created
- [x] AsyncStorage service created

#### Phase 2: Core Features
- [x] TaskContext for state management
- [x] GamificationContext for XP/levels/streaks
- [x] SettingsContext for app settings
- [x] Common UI components (Button, Input, Modal)
- [x] Gamification components (XPBar, LevelBadge, StreakDisplay)
- [x] Task components (TaskCard)
- [x] React Navigation setup
- [x] HomeScreen (Today Focus) - functional
- [x] TaskListScreen - functional with filters
- [x] CalendarScreen - placeholder
- [x] HistoryScreen - basic stats view
- [x] SettingsScreen - functional

## Next Steps (Phase 3+)

### Phase 3: Task Form & Detail
Priority: **HIGH**

- [ ] Create TaskForm component for creating/editing tasks
- [ ] Create TaskDetail screen
- [ ] Implement photo picker for tasks
- [ ] Add category selector
- [ ] Add priority selector
- [ ] Add deadline picker
- [ ] Add recurring task options

**Files to create:**
- `src/components/Task/TaskForm.tsx`
- `src/components/Task/TaskDetail.tsx`
- `src/screens/TaskDetailScreen.tsx`

### Phase 4: Pomodoro Timer
Priority: **HIGH**

- [ ] Create PomodoroTimer component
- [ ] Implement timer logic with background support
- [ ] Add sound notifications
- [ ] Track Pomodoros per task
- [ ] Implement pause/resume/skip
- [ ] Add break timer

**Files to create:**
- `src/components/Pomodoro/PomodoroTimer.tsx`
- `src/services/pomodoro.ts`
- `src/screens/PomodoroScreen.tsx`

### Phase 5: Notifications
Priority: **MEDIUM**

- [ ] Setup notification permissions
- [ ] Create notification service
- [ ] Implement task reminders
- [ ] Implement Pomodoro notifications
- [ ] Implement streak warnings
- [ ] Implement daily motivation notifications

**Files to create:**
- `src/services/notifications.ts`

### Phase 6: Templates & Routines
Priority: **MEDIUM**

- [ ] Create Template list view
- [ ] Create Template form
- [ ] Implement template instantiation
- [ ] Add pre-made templates (morning routine, etc.)
- [ ] Export/Import templates

**Files to create:**
- `src/screens/TemplatesScreen.tsx`
- `src/components/Templates/TemplateCard.tsx`
- `src/components/Templates/TemplateForm.tsx`

### Phase 7: Task Chains
Priority: **LOW**

- [ ] Create chain management UI
- [ ] Implement auto-progression
- [ ] Add chain notifications
- [ ] Add chain visualization

**Files to create:**
- `src/components/Task/TaskChain.tsx`
- `src/screens/ChainScreen.tsx`

### Phase 8: Calendar Integration
Priority: **MEDIUM**

- [ ] Implement full calendar view
- [ ] Add month/week/day views
- [ ] Display tasks on calendar
- [ ] Add deadline visualization

**Update:**
- `src/screens/CalendarScreen.tsx`

### Phase 9: Statistics & Charts
Priority: **LOW**

- [ ] Create chart components
- [ ] Implement completion trends
- [ ] Add category breakdown
- [ ] Add time tracking charts
- [ ] Export statistics

**Files to create:**
- `src/components/Stats/Charts.tsx`
- `src/services/statistics.ts`

### Phase 10: Export/Import
Priority: **MEDIUM**

- [ ] Create export service
- [ ] Implement JSON export
- [ ] Implement JSON import
- [ ] Add validation
- [ ] Add backup scheduling

**Files to create:**
- `src/services/export.ts`

### Phase 11: Polish & Optimization
Priority: **HIGH** (before release)

- [ ] Add loading states
- [ ] Add error handling
- [ ] Add animations (level up, task complete)
- [ ] Optimize performance
- [ ] Add haptic feedback
- [ ] Test on Vivo X80 Pro
- [ ] Fix any bugs

### Phase 12: Android Build Configuration
Priority: **HIGH** (before release)

- [ ] Configure app icons
- [ ] Configure splash screen
- [ ] Setup signing key
- [ ] Configure build.gradle
- [ ] Test release build
- [ ] Optimize APK size

## How to Run

### Development
```bash
cd ADHDTasker
npm start
# In another terminal:
npm run android
```

### Build Debug APK
```bash
cd android
./gradlew assembleDebug
```

### Build Release APK
```bash
cd android
./gradlew assembleRelease
```

## Testing Checklist

Before considering any phase complete:

- [ ] No TypeScript errors
- [ ] No runtime errors
- [ ] Components render correctly
- [ ] Data persists correctly
- [ ] Performance is acceptable (60 FPS)
- [ ] UI is responsive

## Known Issues / TODO

1. **Navigation**: Need to implement navigation to TaskDetail from TaskCard
2. **Task Creation**: Need to create form for adding new tasks
3. **Icons**: Currently using emojis, consider switching to vector icons
4. **Animations**: No animations yet for level up, task completion
5. **Error Handling**: Need better error UI (toast notifications?)
6. **Loading States**: Some screens don't show loading indicators

## Architecture Notes

### Data Flow
```
User Action → Context (State) → Database/Storage → UI Update
```

### Context Hierarchy
```
SettingsProvider
  └─ GamificationProvider
      └─ TaskProvider
          └─ AppNavigator
```

### Database Tables
- `tasks` - All task data
- `templates` - Task templates
- `pomodoro_sessions` - Pomodoro tracking
- `task_chains` - Task chain data
- `categories` - Custom categories

### AsyncStorage Keys
- `@adhd_tasker_settings` - App settings
- `@adhd_tasker_stats` - User stats (XP, streaks, etc.)
- `@adhd_tasker_categories` - Categories
- `@adhd_tasker_today_focus` - Today Focus config

## Performance Targets

- App startup: < 2 seconds
- List rendering: < 500ms for 1000 tasks
- Animations: 60 FPS
- Database queries: < 100ms

## Code Style

- Use TypeScript strictly
- Use functional components with hooks
- Follow React Native best practices
- Comment complex logic
- Use meaningful variable names
- Keep components small and focused

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/task-form

# Make changes and commit
git add .
git commit -m "feat: add task form component"

# Push and create PR
git push origin feature/task-form
```

## Useful Commands

```bash
# Clear cache
npm start -- --reset-cache

# Check TypeScript errors
npx tsc --noEmit

# Format code
npm run lint

# Clear Android build
cd android && ./gradlew clean
```

## Resources

- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SQLite](https://github.com/andpor/react-native-sqlite-storage)

---

**Last Updated**: November 20, 2025
**Version**: 0.1.0 (Phase 2 Complete)
