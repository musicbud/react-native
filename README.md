# MusicBud React Native (Expo) Application

This document provides a summary of the work done to set up the MusicBud React Native application using Expo Go, including the integration of screens based on provided Figma images, navigation setup, and strategies for API integration and testing.

## Summary of Work Done

1. **Project Initialization:** A new Expo project named `musicbud-expo` was successfully created.
2. **Project Structure:** A structured project layout was established within the `musicbud-expo` directory, including:
    * `src/components`
    * `src/screens`
    * `src/navigation`
    * `src/assets`
3. **Figma Image Integration:** All exported Figma images from the provided `@ui` directory (and its subdirectories `Search` and `extra`) were copied into `musicbud-expo/src/assets/ui`.
4. **Screen Component Generation:** React Native placeholder screen components were created for each identified Figma image. Each component displays its corresponding image as a background and a screen title for identification. This includes the `IntroductionScreen`, which was derived from the previously generated Figma code.
5. **Navigation Setup:** React Navigation was configured using `expo-router` with a `Stack.Navigator`. This sets up the basic navigation flow between all the generated screens, with `IntroductionScreen` as the initial route.
    * `musicbud-expo/app/_layout.tsx`: Defines the root Stack Navigator.
    * `musicbud-expo/app/index.tsx`: Redirects to the `IntroductionScreen` as the starting point.
6. **API Integration Strategy:** A detailed `API_INTEGRATION_STRATEGY.md` document was created in the project root, proposing a layered architecture for API interaction (Network Layer, Data Sources, Repositories), along with recommendations for state management (Redux Toolkit or Context API + React Query).
7. **Testing Strategy:** A `TESTING_STRATEGY.md` document was created in the project root, outlining comprehensive testing approaches for Unit, Integration, and End-to-End testing using Jest and React Native Testing Library.
8. **Backend API Integration:** Transitioned key screens (like `Buds` and `Chat`) from using hardcoded mock data to fetching real data from the backend API using RTK Query.

## How to Run the Expo Application

1. **Navigate to the project directory:**

    ```bash
    cd musicbud-expo
    ```

2. **Start the Expo development server:**

    ```bash
    npx expo start
    ```

3. **Open the app:**
    * Scan the QR code displayed in your terminal with the Expo Go app on your physical device.
    * Alternatively, choose to run on an Android emulator or iOS simulator (requires Xcode on macOS for iOS).

## Configure Custom Fonts (Crucial for Correct Display)

The `IntroductionScreen` (and potentially other future components if detailed Figma designs are manually converted) requires custom fonts for accurate visual representation.

* **Action Required from You:** Please provide the `.ttf` or `.otf` font files for the following fonts:
  * `PoiretOne-Regular`
  * `Jost-Bold`
  * `Jost-Regular`
  * `Typo Round Bold Demo:Regular`

* **Once you have the font files, follow these steps:**
    1. **Create an `assets/fonts` directory** in the root of your `musicbud-expo` project:

        ```bash
        mkdir -p assets/fonts
        ```

    2. **Place the acquired font files** into the `musicbud-expo/assets/fonts` directory.
    3. **Create a `react-native.config.js` file** at the root of your `musicbud-expo` project (if it doesn't already exist) with the following content:

        ```javascript
        module.exports = {
          assets: ['./assets/fonts/'],
        };
        ```

    4. **Link the assets:**

        ```bash
        cd musicbud-expo
        npx react-native link
        ```

        *(You might need to rebuild your app after linking fonts for the changes to take effect).*
    5. **Verify `fontFamily` names:** Ensure the `fontFamily` values used in the components (e.g., `src/screens/IntroductionScreen.tsx`) exactly match the base names of your font files (e.g., if the file is `MyCustomFont-Regular.ttf`, use `fontFamily: 'MyCustomFont-Regular'`).

This completes the setup of the MusicBud React Native application with Expo Go, based on the provided Figma image assets.
