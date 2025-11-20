# Android Build Troubleshooting

## CMake Build Error: "ninja: error: manifest 'build.ninja' still dirty after 100 tries"

This error occurs when react-native-reanimated's CMake configuration enters an infinite loop regenerating build files on Windows.

### Solution

The project has been configured with the following fixes:

1. **gradle.properties** - Added CMake arguments to disable compile commands export
2. **app/build.gradle** - Added CMake configuration in defaultConfig to prevent rebuild loops

### If the error persists, follow these steps:

#### On Windows:

1. **Clean CMake cache:**
   ```powershell
   # Navigate to your project root
   cd C:\path\to\ADHDTasker

   # Delete CMake build cache
   Remove-Item -Recurse -Force node_modules\react-native-reanimated\android\.cxx
   ```

2. **Clean Gradle cache:**
   ```powershell
   cd android
   .\gradlew clean
   ```

3. **Clear Gradle build cache (optional):**
   ```powershell
   # This clears the global Gradle cache
   Remove-Item -Recurse -Force $env:USERPROFILE\.gradle\caches
   ```

4. **Rebuild:**
   ```powershell
   cd ..
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
