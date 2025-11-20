# Android Build Troubleshooting

## CMake Build Error: "ninja: error: manifest 'build.ninja' still dirty after 100 tries"

This error occurs when react-native-reanimated's CMake configuration enters an infinite loop regenerating build files on Windows. This is a known issue with CMake file globbing on Windows that triggers constant regeneration.

### Solution

The project has been configured with the following fixes:

1. **android/gradle.properties** - Disabled CMake file API (`android.enableCmakeFileApi=false`)
2. **android/build.gradle** - Added subprojects configuration to apply CMake arguments specifically to react-native-reanimated

### QUICKEST FIX: Reinstall react-native-reanimated

The most reliable solution is to completely reinstall react-native-reanimated:

```powershell
# From your project root
npm uninstall react-native-reanimated
npm install react-native-reanimated@~3.10.1

# Clean and rebuild
cd android
.\gradlew clean
cd ..
npm run android
```

### ALTERNATIVE: Clean CMake cache manually

If you prefer not to reinstall, you can manually clean the corrupted CMake cache:

#### On Windows:

1. **Stop any running Metro bundler or build processes**

2. **Delete CMake build cache:**
   ```powershell
   # Navigate to your project root
   cd C:\path\to\ADHDTasker

   # Delete CMake build cache - THIS IS CRITICAL
   Remove-Item -Recurse -Force node_modules\react-native-reanimated\android\.cxx -ErrorAction SilentlyContinue
   ```

3. **Clean Gradle cache:**
   ```powershell
   cd android
   .\gradlew clean
   cd ..
   ```

4. **Rebuild:**
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
