import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import ApolloProvider from "@/graphql/apollo-provider";
import RNPaperConfig from "@/configs/RNPaper";

import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import { SnackbarV2Provider } from "@/contexts/SnackbarV2Context";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { StatusBar } from "expo-status-bar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { AppState } from "react-native";
import SplashScreenCustom from "@components/SplashScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const useAppFonts = () => {
  return useFonts({
    "Prompt-Black": require("../assets/fonts/Prompt-Black.ttf"),
    "Prompt-BlackItalic": require("../assets/fonts/Prompt-BlackItalic.ttf"),
    "Prompt-Bold": require("../assets/fonts/Prompt-Bold.ttf"),
    "Prompt-BoldItalic": require("../assets/fonts/Prompt-BoldItalic.ttf"),
    "Prompt-ExtraBold": require("../assets/fonts/Prompt-ExtraBold.ttf"),
    "Prompt-ExtraBoldItalic": require("../assets/fonts/Prompt-ExtraBoldItalic.ttf"),
    "Prompt-ExtraLight": require("../assets/fonts/Prompt-ExtraLight.ttf"),
    "Prompt-ExtraLightItalic": require("../assets/fonts/Prompt-ExtraLightItalic.ttf"),
    "Prompt-Italic": require("../assets/fonts/Prompt-Italic.ttf"),
    "Prompt-Light": require("../assets/fonts/Prompt-Light.ttf"),
    "Prompt-LightItalic": require("../assets/fonts/Prompt-LightItalic.ttf"),
    "Prompt-Medium": require("../assets/fonts/Prompt-Medium.ttf"),
    "Prompt-MediumItalic": require("../assets/fonts/Prompt-MediumItalic.ttf"),
    "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
    "Prompt-SemiBold": require("../assets/fonts/Prompt-SemiBold.ttf"),
    "Prompt-SemiBoldItalic": require("../assets/fonts/Prompt-SemiBoldItalic.ttf"),
    "Prompt-Thin": require("../assets/fonts/Prompt-Thin.ttf"),
    "Prompt-ThinItalic": require("../assets/fonts/Prompt-ThinItalic.ttf"),
  });
};

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider>
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={RNPaperConfig}>
          <ThemeProvider value={DefaultTheme}>
            <SnackbarProvider>
              <SnackbarV2Provider>
                <ActionSheetProvider>
                  <BottomSheetModalProvider>
                    <SafeAreaProvider>
                      <StatusBar style="dark" />
                      {children}
                    </SafeAreaProvider>
                  </BottomSheetModalProvider>
                </ActionSheetProvider>
              </SnackbarV2Provider>
            </SnackbarProvider>
          </ThemeProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  </ApolloProvider>
);

const RootLayoutNav = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    isInitialized,
    requirePasswordChange,
    requireAcceptedPolicy,
  } = useAuth();
  const [appState, setAppState] = useState(AppState.currentState);
  const [fontLoaded, fontLoadError] = useAppFonts();

  useEffect(() => {
    const _subscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        setAppState(nextAppState);
      }
    );

    return () => {
      _subscription.remove();
    };
  }, []);

  useEffect(() => {
    // ถ้ามี Error จากการโหลดฟอนต์ ให้แสดง Error ทันที
    if (fontLoadError) throw fontLoadError;

    // รอจนกว่าฟอนต์จะโหลดเสร็จ และ AuthContext จะพร้อมใช้งาน
    if (!fontLoaded || !isInitialized) return;

    // เมื่อทุกอย่างพร้อม ให้ซ่อน Splash Screen
    SplashScreen.hideAsync();

    if (appState !== "active") {
      return;
    }

    // --- ส่วน Logic การ Redirect ที่สมบูรณ์ ---
    if (isAuthenticated) {
      if (requirePasswordChange) {
        router.replace("/(app)/change-password");
      } else if (requireAcceptedPolicy) {
        router.replace("/(app)/readfirst");
      } else {
        // ถ้าทุกอย่างเรียบร้อยดี ให้ไปที่หน้าหลักของแอป
        router.replace("/(app)/(tabs)");
      }
    } else {
      // ถ้ายังไม่ Login ให้ไปที่หน้า Login
      router.replace("/(auth)/login");
    }
  }, [
    fontLoaded,
    fontLoadError,
    isInitialized,
    isAuthenticated,
    requirePasswordChange,
    requireAcceptedPolicy,
    appState,
    router,
  ]);

  if (!fontLoaded || !isInitialized) {
    return <SplashScreenCustom />;
  }

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AppProviders>
      <RootLayoutNav />
    </AppProviders>
  );
}
