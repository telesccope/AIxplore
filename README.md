# 🏛️ AIxplore: England Statue Recognition App (React Native)

A cross-platform mobile app built with [**React Native**](https://reactnative.dev) that uses **RAG (Retrieval-Augmented Generation)** to identify and describe statues across England. This project serves as the **frontend** for the AI-powered cultural discovery experience.

## 🚀 Getting Started

> ⚠️ **Before you begin**, ensure your development environment is properly configured. Follow the official [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) guide up to the "Creating a new application" step.

---

### 1. Start the Metro Bundler

In the project root, run:

```bash
# Using npm
npm start

# OR reset cache
npx react-native start --reset-cache

# OR using Yarn
yarn start
```

---

### 2. Launch the App

In a separate terminal:

#### Android

```bash
npm run android
# OR
yarn android
```

#### iOS

```bash
npm run ios
# OR
yarn ios
```

---

### 3. Modify App

Edit files like `App.js` or `src/screens` and reload:

* Android: Double press <kbd>R</kbd> or press <kbd>Cmd/Ctrl</kbd> + <kbd>M</kbd> → Reload
* iOS: Press <kbd>Cmd</kbd> + <kbd>R</kbd>

---

### 4. Compile App

For release build:
```sh
./gradlew assembleRelease
```
the final file is located at **./android/app/build/outputs/apk**
the following command will build 'aab' file
```
./gradlew bundleRelease
```
### **2. Install APK on Device**

```sh
adb install app/build/outputs/apk/release/app-release.apk
```

## 📁 Project Structure

Here's a simplified overview of the key directories and their responsibilities:

```bash
.
├── App.js                 # Root component
├── index.js              # Entry point for React Native
├── assets/               # Static images (e.g., logo)
├── src/                  # Main source code
│   ├── actions/          # Redux action creators (audio, chat, user, etc.)
│   ├── components/       # Reusable UI components (ChatWindow, Button, Input, etc.)
│   ├── constants/        # API endpoints and fixed values
│   ├── navigation/       # React Navigation configs (Auth, Home, Root navigators)
│   ├── reducers/         # Redux reducers (chat, auth, user)
│   ├── screens/          # App screens (Login, Home, Map, Profile, etc.)
│   │   ├── auth/         # Login/Register/Forgot Password
│   │   └── main/         # Main app screens (Chat, Map, Home)
│   ├── types/            # Type definitions for Redux actions and state
│   └── utils/            # Utility functions (e.g., storage helpers)
├── store.js              # Redux store setup
├── metro.config.js       # Metro bundler config
└── package.json          # Project dependencies and scripts
```

---

## 🤖 Core Features

* **RAG-Powered Statue Identification**
  Snap or upload photos to get rich information about English statues using retrieval-augmented generation.

* **Map Integration**
  View nearby statues on an interactive map.

* **Chat Interface**
  Ask questions and get AI-powered contextual answers about monuments.

* **Profile Management**
  Login, register, and update user preferences.

---

## 🛠️ Troubleshooting

* Stuck with Gradle? Try cleaning your project:

```bash
cd android
./gradlew clean
./gradlew --stop
```

* Remove Gradle caches if needed:

```bash
rm -rf ~/.gradle/caches
```

* View logs (Android):

```bash
adb logcat '*:S' ReactNative:V ReactNativeJS:V
```

---

## 📚 Learn More

* [React Native Docs](https://reactnative.dev/docs/getting-started)
* [Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)
* [Integration with Existing Apps](https://reactnative.dev/docs/integration-with-existing-apps)

---

