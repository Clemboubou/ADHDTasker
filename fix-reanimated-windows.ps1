# Fix react-native-reanimated CMake rebuild loop on Windows
# This script cleans the corrupted CMake cache that causes infinite regeneration loops

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " React Native Reanimated CMake Fix" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if react-native-reanimated is installed
if (!(Test-Path "node_modules\react-native-reanimated")) {
    Write-Host "ERROR: react-native-reanimated not found." -ForegroundColor Red
    Write-Host "Please run 'npm install' first." -ForegroundColor Red
    exit 1
}

Write-Host "[1/4] Deleting corrupted CMake cache..." -ForegroundColor Yellow
$cxxPath = "node_modules\react-native-reanimated\android\.cxx"
if (Test-Path $cxxPath) {
    Remove-Item -Recurse -Force $cxxPath -ErrorAction SilentlyContinue
    Write-Host "      Deleted .cxx cache" -ForegroundColor Green
} else {
    Write-Host "      .cxx cache not found (already clean)" -ForegroundColor Green
}

Write-Host "`n[2/4] Cleaning Gradle build cache..." -ForegroundColor Yellow
Set-Location android
$cleanOutput = & .\gradlew clean 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Gradle cache cleaned successfully" -ForegroundColor Green
} else {
    Write-Host "      Warning: Gradle clean had issues (continuing...)" -ForegroundColor Yellow
}
Set-Location ..

Write-Host "`n[3/4] Cleaning Android build directory..." -ForegroundColor Yellow
$buildPath = "android\app\build"
if (Test-Path $buildPath) {
    Remove-Item -Recurse -Force $buildPath -ErrorAction SilentlyContinue
    Write-Host "      Cleaned android/app/build" -ForegroundColor Green
} else {
    Write-Host "      Build directory already clean" -ForegroundColor Green
}

Write-Host "`n[4/4] Cleaning .gradle directory (optional but recommended)..." -ForegroundColor Yellow
$gradlePath = "android\.gradle"
if (Test-Path $gradlePath) {
    try {
        Remove-Item -Recurse -Force $gradlePath -ErrorAction Stop
        Write-Host "      Cleaned .gradle directory" -ForegroundColor Green
    } catch {
        Write-Host "      Could not delete .gradle (may be in use - this is OK)" -ForegroundColor Yellow
    }
} else {
    Write-Host "      .gradle directory already clean" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host " Fix Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm run android" -ForegroundColor White
Write-Host "  2. If the issue persists:" -ForegroundColor White
Write-Host "     - Close Android Studio if it's open" -ForegroundColor White
Write-Host "     - Run this script again" -ForegroundColor White
Write-Host "     - Try: npm uninstall react-native-reanimated && npm install react-native-reanimated@~3.10.1" -ForegroundColor White
Write-Host ""
