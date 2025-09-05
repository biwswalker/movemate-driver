import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
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
import SplashScreenCustom from "@components/SplashScreen";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ActiveJobProvider } from "@/contexts/ActiveJobContext";
import "@/tasks/locationTask";
import * as Location from "expo-location";
import { AppState } from "react-native";
import { PermissionRequestScreen } from "@/components/PermissionRequest";

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
  <AuthProvider>
    <ApolloProvider>
      <ActiveJobProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider theme={RNPaperConfig}>
            <ThemeProvider value={DefaultTheme}>
              <SnackbarProvider>
                <SnackbarV2Provider>
                  <NotificationProvider>
                    <ActionSheetProvider>
                      <BottomSheetModalProvider>
                        <SafeAreaProvider>
                          <StatusBar style="dark" />
                          {children}
                        </SafeAreaProvider>
                      </BottomSheetModalProvider>
                    </ActionSheetProvider>
                  </NotificationProvider>
                </SnackbarV2Provider>
              </SnackbarProvider>
            </ThemeProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </ActiveJobProvider>
    </ApolloProvider>
  </AuthProvider>
);

const RootLayoutNav = () => {
  const router = useRouter();
  const segments = useSegments();
  const {
    isFirstLaunch,
    isAuthenticated,
    isInitialized,
    requirePasswordChange,
    requireAcceptedPolicy,
  } = useAuth();
  const [fontLoaded, fontLoadError] = useAppFonts();
  const [allPermissionsGranted, setAllPermissionsGranted] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      // 1. ตรวจสอบ Foreground
      const { status: foregroundStatus } =
        await Location.getForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        setIsCheckingPermission(false);
        setAllPermissionsGranted(false);
        return;
      }

      // 2. ถ้า Foreground ผ่านแล้ว ตรวจสอบ Background
      const { status: backgroundStatus } =
        await Location.getBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        setIsCheckingPermission(false);
        setAllPermissionsGranted(false);
        return;
      }

      // 3. ผ่านทั้งคู่ ถึงจะถือว่าได้รับอนุญาตทั้งหมด
      setAllPermissionsGranted(true);
      setIsCheckingPermission(false);
    };
    checkPermissions();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkPermissions();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (fontLoadError) throw fontLoadError;

    // รอจนกว่าฟอนต์และ auth จะพร้อม
    if (!fontLoaded || !isInitialized || isCheckingPermission) {
      return;
    }

    // ซ่อน Splash screen หลังจากจัดการ routing เรียบร้อยแล้ว
    SplashScreen.hideAsync();

    // --- ทำการ Redirect ต่อเมื่อได้รับ Permission แล้วเท่านั้น ---
    // ตรวจสอบว่าผู้ใช้อยู่ในกลุ่ม route ที่ถูกต้องหรือยัง
    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(app)";

    // --- 5. ปรับปรุง Logic การ Redirect ---
    if (isAuthenticated) {
      // เมื่อผู้ใช้ล็อกอินแล้ว
      if (allPermissionsGranted) {
        if (requirePasswordChange) {
          // บังคับไปหน้าเปลี่ยนรหัสผ่าน
          router.replace("/(app)/change-password");
        } else if (requireAcceptedPolicy) {
          // บังคับไปหน้ายอมรับนโยบาย
          router.replace("/(app)/readfirst");
        } else if (!inAppGroup) {
          // ถ้าล็อกอินแล้ว แต่ไม่ได้อยู่ในโซน (app) ให้ส่งไปหน้าหลัก
          // คำสั่งนี้จะทำงานแค่ครั้งแรกที่เข้าแอป หรือตอนที่ล็อกอินสำเร็จ
          router.replace("/(app)/(tabs)");
        }
      }
    } else if (!inAuthGroup) {
      // เมื่อผู้ใช้ยังไม่ได้ล็อกอิน และไม่ได้อยู่ในโซน (auth) ให้ส่งไปหน้าล็อกอิน
      if (isFirstLaunch) {
        router.replace("/(auth)");
      } else {
        router.replace("/(auth)/landing");
      }
    }
  }, [
    fontLoaded,
    fontLoadError,
    isInitialized,
    isAuthenticated,
    requirePasswordChange,
    requireAcceptedPolicy,
    segments, // เพิ่ม segments เข้าไปใน dependency array
    router,
    allPermissionsGranted,
    isCheckingPermission,
  ]);

  if (!fontLoaded || !isInitialized || isCheckingPermission) {
    return <SplashScreenCustom />;
  }

  if (isAuthenticated && !allPermissionsGranted) {
    return <PermissionRequestScreen />;
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
