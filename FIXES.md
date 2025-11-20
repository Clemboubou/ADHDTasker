# ADHD Task Manager - Corrections Appliquées

## ✅ Corrections CRITIQUES Appliquées

### 1. Navigation Fixée ✅
**Problème**: Pas de Stack Navigator, impossible de naviguer vers les détails
**Solution**:
- Ajouté `createStackNavigator`
- Créé `TabNavigator` pour les tabs
- Créé `AppNavigator` (Stack) qui wraps les tabs
- Ajouté route `TaskDetail` avec params

**Fichiers modifiés**:
- `src/navigation/AppNavigator.tsx`

### 2. TaskDetailScreen avec Navigation ✅
**Problème**: Props incompatibles avec navigation
**Solution**:
- Utilisé `StackScreenProps<RootStackParamList, 'TaskDetail'>`
- Extrait `taskId` depuis `route.params`
- Remplacé `onClose()` par `navigation.goBack()`

**Fichiers modifiés**:
- `src/screens/TaskDetailScreen.tsx`

### 3. Notifications Initialisées ✅
**Problème**: `initNotifications()` jamais appelé
**Solution**:
- Ajouté `useEffect` dans App.tsx
- Appel `initNotifications()` au démarrage

**Fichiers modifiés**:
- `App.tsx`

---

## ⚠️ Corrections à Faire Avant Build

### 4. Permissions Android (CRITIQUE)
**Fichier à créer**: `android/app/src/main/AndroidManifest.xml`

Ajouter avant `</application>`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
```

### 5. React Native Vector Icons (MEDIUM)
**Problème**: Dépendance installée mais pas configurée

**Option A - Garder les emojis (RECOMMANDÉ)**:
```bash
npm uninstall react-native-vector-icons
```

**Option B - Utiliser vector icons**:
```bash
# android/app/build.gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### 6. SQLite Types (HIGH)
**Problème**: Types TypeScript manquants

**Solution**:
```bash
npm install --save-dev @types/react-native-sqlite-storage
```

OU créer `src/types/react-native-sqlite-storage.d.ts`:
```typescript
declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    executeSql(sql: string, params?: any[]): Promise<[ResultSet]>;
    close(): Promise<void>;
  }

  export interface ResultSet {
    rows: {
      length: number;
      item(index: number): any;
    };
  }

  export function openDatabase(config: {
    name: string;
    location?: string;
  }): Promise<SQLiteDatabase>;

  export function DEBUG(debug: boolean): void;
  export function enablePromise(enable: boolean): void;
}
```

### 7. Background Timer Deprecated (HIGH)
**Problème**: `react-native-background-timer` est obsolète

**Solution**:
```bash
npm uninstall react-native-background-timer
npm install @react-native-community/background-timer
```

Puis dans `src/components/Pomodoro/PomodoroTimer.tsx`:
```typescript
import BackgroundTimer from '@react-native-community/background-timer';
```

### 8. Image Picker API Update (MEDIUM)
**Fichier**: `src/components/Task/TaskForm.tsx`, ligne 15

**Ancien**:
```typescript
import { launchImageLibrary } from 'react-native-image-picker';
```

**Nouveau** (v7.1.2):
```typescript
import { launchImageLibrary, Asset } from 'react-native-image-picker';

// Dans handleAddPhoto:
const result = await launchImageLibrary({
  mediaType: 'photo',
  quality: 0.8,
  selectionLimit: 5 - photos.length,
  includeBase64: false,
});
```

### 9. React Native FS Types (MEDIUM)
**Solution**:
```bash
npm install --save-dev @types/react-native-fs
```

---

## 📝 Corrections Fonctionnelles à Faire

### 10. Navigation vers TaskDetail
**Fichiers**: HomeScreen, TaskListScreen, CalendarScreen, HistoryScreen

**Avant**:
```typescript
onPress={() => console.log('Task:', task.id)}
```

**Après**:
```typescript
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
```

### 11. Créer Task Modal/Screen
**Action**: Créer un modal ou screen pour TaskForm

**Option A - Modal**:
Ajouter dans chaque screen:
```typescript
const [showTaskForm, setShowTaskForm] = useState(false);

<Modal visible={showTaskForm} onClose={() => setShowTaskForm(false)}>
  <TaskForm
    onSubmit={async (data) => {
      await createTask(data);
      setShowTaskForm(false);
    }}
    onCancel={() => setShowTaskForm(false)}
  />
</Modal>
```

**Option B - Stack Screen**:
Ajouter dans AppNavigator:
```typescript
<Stack.Screen
  name="TaskForm"
  component={TaskFormScreen}
  options={{
    title: 'Create Task',
    presentation: 'modal',
  }}
/>
```

### 12. Implémenter Deadline Picker
**Fichier**: `src/components/Task/TaskForm.tsx`

Ajouter:
```bash
npm install @react-native-community/datetimepicker
```

```typescript
import DateTimePicker from '@react-native-community/datetimepicker';

// Dans le formulaire:
{showDatePicker && (
  <DateTimePicker
    value={deadline || new Date()}
    mode="datetime"
    onChange={(event, date) => {
      setShowDatePicker(false);
      if (date) setDeadline(date);
    }}
  />
)}
```

### 13. Export/Import UI Implementation
**Fichier**: `src/screens/SettingsScreen.tsx`

```typescript
import { exportAllData, importData } from '../services/export';
import DocumentPicker from 'react-native-document-picker';

const handleExport = async () => {
  try {
    const path = await exportAllData();
    Alert.alert('Success', `Data exported to: ${path}`);
  } catch (error) {
    Alert.alert('Error', 'Failed to export data');
  }
};

const handleImport = async () => {
  try {
    const result = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.json],
    });
    await importData(result.uri);
    Alert.alert('Success', 'Data imported successfully');
  } catch (error) {
    Alert.alert('Error', 'Failed to import data');
  }
};
```

---

## 🔧 Commandes de Build

### Avant le premier build:
```bash
cd ADHDTasker

# 1. Installer dépendances manquantes
npm install --save-dev @types/react-native-sqlite-storage @types/react-native-fs

# 2. Remplacer background timer
npm uninstall react-native-background-timer
npm install @react-native-community/background-timer

# 3. Installer date picker
npm install @react-native-community/datetimepicker

# 4. Installer document picker (pour import)
npm install react-native-document-picker

# 5. Nettoyer et rebuild
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
```

### Lancer l'app:
```bash
npm run android
```

---

## 📊 État Actuel

### ✅ Fonctionnel:
- Structure du projet
- Contexts (Task, Gamification, Settings)
- Base de données (tables, CRUD)
- Navigation (Stack + Tabs)
- UI Components (Button, Input, Modal, etc.)
- Écrans (Home, Tasks, Calendar, Templates, History, Settings)
- Services (database, storage, export)
- Notifications (service créé)

### ⚠️ À Compléter Avant Build:
- Permissions Android
- Types TypeScript manquants
- Background timer update
- Image picker API update

### 📝 À Implémenter Pour Utilisation Complète:
- Navigation vers TaskDetail (dans tous les écrans)
- Modal/Screen de création de tâche
- Deadline picker
- Export/Import UI
- Affichage des photos
- Animations de level-up

---

## 🎯 Priorités

### Immédiat (Build):
1. ✅ Navigation fixée
2. ✅ Notifications initialisées
3. ⚠️ Permissions Android
4. ⚠️ Types manquants
5. ⚠️ Background timer

### Haute Priorité (Utilisation):
6. Navigation vers TaskDetail dans tous les écrans
7. Modal de création de tâche
8. Deadline picker

### Moyenne Priorité (Polish):
9. Export/Import UI
10. Affichage photos
11. Animations
12. Charts dans History

---

## 📖 Documentation Mise à Jour

Tous les fichiers de documentation reflètent maintenant l'état actuel:
- README.md
- DEVELOPMENT.md
- COMPLETE_PROJECT.md
- FIXES.md (ce fichier)

Le projet est maintenant **prêt à être buildé** après avoir appliqué les corrections des permissions Android et des types manquants.
