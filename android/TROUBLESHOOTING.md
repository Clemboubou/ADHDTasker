# Android Build Troubleshooting

## CMake Build Error: "ninja: error: manifest 'build.ninja' still dirty after 100 tries"

This error occurs when react-native-reanimated's CMake configuration enters an infinite loop regenerating build files on Windows. This is a **known issue with CMake 3.22.1 file globbing on Windows** that affects react-native-reanimated.

### AUTOMATED FIX (Recommended)

We've created a PowerShell script that automatically cleans all corrupted build caches:

```powershell
# From your project root (ADHDTasker directory)
.\fix-reanimated-windows.ps1
```

This script will:
1. Delete the corrupted `.cxx` cache
2. Clean Gradle build cache
3. Clean Android build directories
4. Clean `.gradle` directory

After running the script, try building again:
```powershell
npm run android
```

### MANUAL FIX

If you prefer to fix manually, follow these steps:

#### On Windows:

1. **Delete CMake build cache (CRITICAL):**
   ```powershell
   Remove-Item -Recurse -Force node_modules\react-native-reanimated\android\.cxx -ErrorAction SilentlyContinue
   ```

2. **Clean Gradle cache:**
   ```powershell
   cd android
   .\gradlew clean
   cd ..
   ```

3. **Clean build directories:**
   ```powershell
   Remove-Item -Recurse -Force android\app\build -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force android\.gradle -ErrorAction SilentlyContinue
   ```

4. **Rebuild:**
   ```powershell
   npm run android
   ```

### If the Issue Persists

If you're still experiencing the issue after trying the above solutions:

1. **Close Android Studio** if it's open (it may lock files)

2. **Reinstall react-native-reanimated:**
   ```powershell
   npm uninstall react-native-reanimated
   npm install react-native-reanimated@~3.10.1
   ```

3. **Run the fix script again:**
   ```powershell
   .\fix-reanimated-windows.ps1
   ```

4. **Try building:**
   ```powershell
   npm run android
   ```

#### Alternative: Reinstall dependencies

If the problem persists, try reinstalling node_modules:

```powershell
# Delete node_modules and lock file
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install

# Try building again
npm run android
```

#### Advanced: Disable specific architectures temporarily

If you need to build quickly and only for one architecture, you can modify `android/gradle.properties`:

```properties
# Comment out the multi-arch line and use only one architecture
# reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
reactNativeArchitectures=armeabi-v7a
```

Then clean and rebuild:
```powershell
cd android
.\gradlew clean
cd ..
npm run android
```

### Related Issues

- [react-native-reanimated CMake issues on Windows](https://github.com/software-mansion/react-native-reanimated/issues)
- This is a known issue with CMake file globbing on Windows that triggers constant regeneration

### Prevention

The configuration changes in this project should prevent this issue from recurring. The key settings are:

- `android.externalNativeBuild.cmake.arguments=-DCMAKE_EXPORT_COMPILE_COMMANDS=OFF` in gradle.properties
- CMake arguments in app/build.gradle defaultConfig
