import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "@/components/NavigationBar";

export default function ViewPdfScreen() {
  const { back } = useRouter();
  const { uri, fileName } = useLocalSearchParams<{
    uri: string;
    fileName?: string;
  }>();
  const backgroundColor = useThemeColor({}, "background");

  const handleDownload = async () => {
    if (!uri) return;

    try {
      const fileUri =
        FileSystem.documentDirectory + (fileName || "downloaded.pdf");
      const { uri: localUri } = await FileSystem.downloadAsync(uri, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(localUri);
      } else {
        Alert.alert(
          "ไม่สามารถแชร์ไฟล์ได้",
          "อุปกรณ์ของคุณไม่รองรับฟังก์ชันนี้"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถดาวน์โหลดไฟล์ PDF ได้");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar onBack={back} containerStyle={styles.navigator} />
        <View style={[styles.content, { backgroundColor }]}>
          {uri ? <WebView source={{ uri }} style={styles.webview} /> : null}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            fullWidth
            title="ดาวน์โหลด PDF"
            onPress={handleDownload}
            disabled={!uri}
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  navigator: {
    paddingVertical: 24,
  },
  buttonContainer: {
    padding: 16,
  },
});
