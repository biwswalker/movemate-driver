import {
  DefaultTheme,
  // NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import ApolloProvider from "@/graphql/apollo-provider";
import RNPaperConfig from "@/configs/RNPaper";
import * as Notifications from 'expo-notifications';

import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import { SnackbarV2Provider } from "@/contexts/SnackbarV2Context";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { StatusBar } from "expo-status-bar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { usePushNotification } from '@/hooks/usePushNotification'; 


// 
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [loaded] = useFonts({
    ["Prompt-Black"]: require("../assets/fonts/Prompt-Black.ttf"),
    ["Prompt-BlackItalic"]: require("../assets/fonts/Prompt-BlackItalic.ttf"),
    ["Prompt-Bold"]: require("../assets/fonts/Prompt-Bold.ttf"),
    ["Prompt-BoldItalic"]: require("../assets/fonts/Prompt-BoldItalic.ttf"),
    ["Prompt-ExtraBold"]: require("../assets/fonts/Prompt-ExtraBold.ttf"),
    ["Prompt-ExtraBoldItalic"]: require("../assets/fonts/Prompt-ExtraBoldItalic.ttf"),
    ["Prompt-ExtraLight"]: require("../assets/fonts/Prompt-ExtraLight.ttf"),
    ["Prompt-ExtraLightItalic"]: require("../assets/fonts/Prompt-ExtraLightItalic.ttf"),
    ["Prompt-Italic"]: require("../assets/fonts/Prompt-Italic.ttf"),
    ["Prompt-Light"]: require("../assets/fonts/Prompt-Light.ttf"),
    ["Prompt-LightItalic"]: require("../assets/fonts/Prompt-LightItalic.ttf"),
    ["Prompt-Medium"]: require("../assets/fonts/Prompt-Medium.ttf"),
    ["Prompt-MediumItalic"]: require("../assets/fonts/Prompt-MediumItalic.ttf"),
    ["Prompt-Regular"]: require("../assets/fonts/Prompt-Regular.ttf"),
    ["Prompt-SemiBold"]: require("../assets/fonts/Prompt-SemiBold.ttf"),
    ["Prompt-SemiBoldItalic"]: require("../assets/fonts/Prompt-SemiBoldItalic.ttf"),
    ["Prompt-Thin"]: require("../assets/fonts/Prompt-Thin.ttf"),
    ["Prompt-ThinItalic"]: require("../assets/fonts/Prompt-ThinItalic.ttf"),
  });

  if (!loaded) {
    return null;
  }

  usePushNotification();

  return (
    <ApolloProvider>
      <AuthProvider>
        <GestureHandlerRootView>
          <PaperProvider theme={RNPaperConfig}>
            <ThemeProvider value={DefaultTheme}>
              <SnackbarProvider>
                <SnackbarV2Provider>
                  {/* <NavigationContainer> */}
                    <ActionSheetProvider>
                      <BottomSheetModalProvider>
                        <SafeAreaProvider>
                          <StatusBar style="dark" />
                          <Slot />
                        </SafeAreaProvider>
                      </BottomSheetModalProvider>
                    </ActionSheetProvider>
                  {/* </NavigationContainer> */}
                </SnackbarV2Provider>
              </SnackbarProvider>
            </ThemeProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </ApolloProvider>
  );
}
