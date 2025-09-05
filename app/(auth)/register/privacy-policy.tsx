import Button from "@components/Button";
import ButtonIcon from "@components/ButtonIcon";
import Text, { FONT_NAME } from "@components/Text";
import React, { useMemo, useState } from "react";
import {
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Iconify } from "react-native-iconify";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import RenderHtml, {
  defaultSystemFonts,
  MixedStyleDeclaration,
  MixedStyleRecord,
} from "react-native-render-html";
import { normalize } from "@utils/normalizeSize";
import Checkbox from "@components/Checkbox";
import {
  EDriverType,
  SettingDriverPolicies,
  useGetDriverPoliciesInfoQuery,
} from "@graphql/generated/graphql";
import { isEmpty } from "lodash";
import colors from "@constants/colors";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { ActivityIndicator } from "react-native-paper";
import {
  DropdownAlertPosition,
  DropdownAlertType,
} from "react-native-dropdownalert";

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    gap: normalize(16),
  },
  headerWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },
  headerText: {
    textAlign: "center",
    flex: 1,
  },
  headerActionWrapper: {
    width: normalize(40),
    position: "absolute",
    right: normalize(16),
  },
  contentWrapper: {
    paddingBottom: 16,
  },
  loadingWrapper: {
    paddingVertical: normalize(32),
  },
  checkboxWrapper: {
    paddingBottom: normalize(32),
    pointerEvents: "auto",
  },
  scrollViewWrapper: {
    paddingHorizontal: normalize(16),
  },
  actionWrapper: {
    paddingBottom: normalize(64),
  },
  checkboxTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: normalize(4),
    flexWrap: "wrap",
  },
  underlineText: {
    // textDecorationLine: "underline",
  },
});

export default function PrivacyPolicy() {
  const { showSnackbar } = useSnackbarV2();
  const [isAccept, setAccept] = useState(false);
  const insets = useSafeAreaInsets();
  const isPresented = router.canGoBack();
  const { width } = useWindowDimensions();
  const { driverType } = useLocalSearchParams<{ driverType: EDriverType }>();

  const { data, loading } = useGetDriverPoliciesInfoQuery({
    onError: (error: Error) => {
      console.log("error: ", error.message);
      showSnackbar({
        message: error.message,
        title: "ข้อผิดพลาด",
        type: DropdownAlertType.Error,
        alertPosition: DropdownAlertPosition.Top,
      });
    },
  });

  const policy = useMemo<SettingDriverPolicies | undefined>(
    () => data?.getDriverPoliciesInfo || undefined,
    [data]
  );

  function onClosePrivacyPolicy(_event: NativeSyntheticEvent<any>) {
    if (isPresented) {
      router.back();
    }
  }

  function onAcceptPolicy() {
    if (policy) {
      router.dismiss();
      const registerRoutes: Href =
        driverType === EDriverType.BUSINESS
          ? "/register/business"
          : "/register/individual";
      router.navigate({
        pathname: registerRoutes,
        params: {
          param: JSON.stringify({
            type: { driverType, version: policy.version },
          }),
        },
      });
    }
  }

  const baseStyle: MixedStyleDeclaration = {
    fontFamily: FONT_NAME.PROMPT_REGULAR,
    lineHeight: normalize(24),
    fontSize: normalize(16),
    color: colors.text.primary,
  };

  const tagStyle: MixedStyleRecord = {
    strong: { fontFamily: FONT_NAME.PROMPT_BOLD },
    em: { fontFamily: FONT_NAME.PROMPT_ITALIC },
  };

  const systemFonts = [...defaultSystemFonts, FONT_NAME.PROMPT_REGULAR];

  return (
    <View style={styles.superContainer}>
      <SafeAreaView style={[styles.container, { paddingTop: insets.top / 2 }]}>
        <View style={styles.wrapper}>
          <View style={styles.headerWrapper}>
            <Text style={styles.headerText} varient="h6">
              {`ข้อกำหนดการให้บริการ\nและนโยบายส่วนตัว`}
            </Text>
            <View style={styles.headerActionWrapper}>
              <ButtonIcon
                onPress={onClosePrivacyPolicy}
                varient="text"
                color="inherit"
              >
                {({ color }) => (
                  <Iconify icon="mi:close" size={24} color={color} />
                )}
              </ButtonIcon>
            </View>
          </View>
          <ScrollView style={styles.scrollViewWrapper}>
            <View style={styles.contentWrapper}>
              {loading && (
                <View style={styles.loadingWrapper}>
                  <ActivityIndicator
                    size="small"
                    color={colors.text.secondary}
                  />
                </View>
              )}
              {policy && (
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: policy.driverPolicies || "",
                  }}
                  tagsStyles={tagStyle}
                  baseStyle={baseStyle}
                  systemFonts={systemFonts}
                />
              )}
            </View>
            <View style={styles.checkboxWrapper}>
              <Checkbox
                label={
                  <View style={styles.checkboxTextWrapper}>
                    <Text varient="body2" color="secondary">
                      ฉันยอมรับ
                    </Text>
                    <Text
                      varient="body2"
                      color="primary"
                      style={styles.underlineText}
                    >
                      ข้อกำหนดการให้บริการ
                    </Text>
                    <Text varient="body2" color="secondary">
                      และ
                    </Text>
                    <Text varient="body2" color="primary">
                      นโยบายความเป็นส่วนตัว
                    </Text>
                  </View>
                }
                onChange={setAccept}
                value={isAccept}
              />
            </View>
            <View style={styles.actionWrapper}>
              <Button
                disabled={!isAccept || loading || isEmpty(policy)}
                size="large"
                title="ดำเนินการต่อ"
                fullWidth
                onPress={onAcceptPolicy}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
