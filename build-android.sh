#!/bin/bash
# ==============================================================================
# King Ludo - Android Build Script (APK & AAB Generation)
# ==============================================================================
set -e

echo "🎲 1. Building Web Assets and Syncing with Capacitor Android..."
npm run build
npx cap sync android

cd android

echo ""
echo "📱 2. Building Debug APK (app-debug.apk)..."
./gradlew assembleDebug

echo ""
echo "🚀 3. Building Release APK..."
./gradlew assembleRelease

echo ""
echo "📦 4. Building Android App Bundle (.aab for Google Play Store)..."
./gradlew bundleRelease

echo ""
echo "=============================================================================="
echo "✅ Build Completed Successfully!"
echo "Outputs location:"
echo "1. Debug APK:        android/app/build/outputs/apk/debug/app-debug.apk"
echo "2. Release APK:      android/app/build/outputs/apk/release/app-release-unsigned.apk (বা app-release.apk)"
echo "3. Play Store AAB:   android/app/build/outputs/bundle/release/app-release.aab"
echo "=============================================================================="
