import Colors from "@constants/colors";
import { ApolloError } from "@apollo/client";
import Text, { FONT_NAME } from "@components/Text";
import {
  SettingDriverPolicies,
  useAcceptedPolicyMutation,
  useGetDriverPoliciesInfoQuery,
} from "@graphql/generated/graphql";
import React, { useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { router } from "expo-router";
import { normalize } from "@/utils/normalizeSize";
import { ActivityIndicator } from "react-native-paper";
import colors from "@constants/colors";
import { ScrollView } from "react-native-gesture-handler";
import RenderHtml, {
  defaultSystemFonts,
  MixedStyleDeclaration,
  MixedStyleRecord,
} from "react-native-render-html";
import Button from "@/components/Button";
import { isEmpty } from "lodash";
import Checkbox from "@/components/Checkbox";
import useAuth from "@/hooks/useAuth";

export default function ReadfirstScreen() {
  const { refetchMe } = useAuth();
  const [isAccept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showSnackbar, DropdownType } = useSnackbarV2();
  const { width } = useWindowDimensions();

  const [acceptedPolicy, { loading: acceptLoading }] =
    useAcceptedPolicyMutation();
  const { data, loading: getLoading } = useGetDriverPoliciesInfoQuery({
    onError: (error: Error) => {
      console.log("error: ", error.message);
      showSnackbar({
        title: "พบข้อผิดพลาด",
        message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
        type: DropdownType.Warn,
      });
    },
  });

  const policy = useMemo<SettingDriverPolicies | undefined>(
    () => data?.getDriverPoliciesInfo || undefined,
    [data]
  );

  function handleError(error: ApolloError) {
    console.log("error: ", error);
    setLoading(false);
    showSnackbar({
      title: "พบข้อผิดพลาด",
      message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
      type: DropdownType.Warn,
    });
  }

  async function handleSuccess() {
    await refetchMe();
    router.push("/");
    setLoading(false);
  }

  async function handleOnAcceptPolicy() {
    setLoading(true);
    acceptedPolicy({
      variables: { data: { version: policy?.version || 0 } },
      onCompleted: handleSuccess,
      onError: handleError,
    });
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
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.contentContainer}>
          <View style={styles.headerWrapper}>
            <Text varient="h3">ยอมรับข้อกำหนด</Text>
            <Text varient="body2" color="secondary">
              เนื่องจากมีการเปลี่ยนแปลงข้อกำหนดการให้บริการและนโยบายส่วนตัว
            </Text>
          </View>
          <ScrollView style={styles.scrollViewWrapper}>
            <View style={styles.contentWrapper}>
              {getLoading && (
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
                      // style={styles.underlineText}
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
                disabled={!isAccept || acceptLoading || isEmpty(policy)}
                loading={loading}
                size="large"
                title="ยอมรับข้อกำหนด"
                fullWidth
                onPress={handleOnAcceptPolicy}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  headerWrapper: {
    padding: normalize(16),
  },
  //
  scrollViewWrapper: {
    paddingHorizontal: normalize(16),
  },
  contentWrapper: {
    paddingBottom: normalize(16),
  },
  loadingWrapper: {
    paddingVertical: normalize(32),
  },
  actionWrapper: {
    paddingBottom: normalize(64),
  },
  checkboxWrapper: {
    paddingBottom: normalize(32),
    pointerEvents: "auto",
  },
  checkboxTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: normalize(4),
    flexWrap: "wrap",
  },
  underlineText: {
    textDecorationLine: "underline",
  },
});
