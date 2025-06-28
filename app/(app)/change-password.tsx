import Colors from "@constants/colors";
import { ApolloError } from "@apollo/client";
import Button from "@components/Button";
import FormProvider from "@components/HookForm/FormProvider";
import RHFTextInput from "@components/HookForm/RHFTextInput";
import Text from "@components/Text";
import { YUP_VALIDATION_ERROR_TYPE } from "@constants/error";
import { useChangePasswordMutation } from "@graphql/generated/graphql";
import { yupResolver } from "@hookform/resolvers/yup";
import { forEach, get } from "lodash";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { router } from "expo-router";
import { normalize } from "@/utils/normalizeSize";
import { TextInput } from "react-native-paper";
import { encryption } from "@/utils/crypto";
import colors from "@constants/colors";
import Yup from "@utils/yup";
import Iconify from "@/components/Iconify";
import useAuth from "@/hooks/useAuth";

interface ChangePasswordFormValue {
  password: string;
  confirmPassword: string;
  afterSubmit?: string;
}

export default function ChangePasswordScreen() {
  const { requireAcceptedPolicy } = useAuth();
  const { showSnackbar, DropdownType } = useSnackbarV2();

  const [openPassword, setOpenPassword] = useState(false);
  const [openConfirmPassword, setOpenConfirmPassword] = useState(false);

  const [changePassword, { loading }] = useChangePasswordMutation();

  const ChangePasswordScema = Yup.object().shape({
    password: Yup.string()
      .matches(
        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "รหัสผ่านสามารถระบุตัวเลขและตัวอักษร ห้ามมีสัญลักษณ์"
      )
      .min(8, "รหัสผ่านจำเป็นต้องมี 8 ตัวขึ้นไป")
      .required("รหัสผ่านสามารถระบุตัวเลขและตัวอักษร ห้ามมีสัญลักษณ์"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "รหัสผ่านไม่ตรงกัน")
      .matches(
        /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "รหัสผ่านสามารถระบุตัวเลขและตัวอักษร ห้ามมีสัญลักษณ์"
      )
      .min(8, "รหัสผ่านจำเป็นต้องมี 8 ตัวขึ้นไป")
      .required("รหัสผ่านสามารถระบุตัวเลขและตัวอักษร ห้ามมีสัญลักษณ์"),
  });

  const defaultValues: ChangePasswordFormValue = useMemo(() => {
    return {
      password: "",
      confirmPassword: "",
      afterSubmit: "",
    };
  }, []);

  // eslint-disable-next-line react/no-unstable-nested-components
  const PassworHelperText = (error: boolean) => {
    return (
      <View style={styles.helperText}>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • รหัสผ่านความยาวจำนวน 8 ตัวขึ้นไป
        </Text>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • สามารถระบุตัวอักษรภาษาอังกฤษและตัวเลข
        </Text>
      </View>
    );
  };

  const ConfirmPassworHelperText = (error: boolean) => {
    return (
      <View style={styles.helperText}>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • รหัสผ่านต้องตรงกันกับต้นฉบับ
        </Text>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • รหัสผ่านความยาวจำนวน 8 ตัวขึ้นไป
        </Text>
        <Text
          varient="caption"
          style={[error && { color: colors.error.main }]}
          color="secondary"
        >
          • สามารถระบุตัวอักษรภาษาอังกฤษและตัวเลข
        </Text>
      </View>
    );
  };

  const methods = useForm<ChangePasswordFormValue>({
    resolver: yupResolver(ChangePasswordScema) as any,
    defaultValues,
    mode: "onBlur",
  });

  const { handleSubmit, setError, setFocus } = methods;

  const eyeIcon = (state: boolean) =>
    state
      ? require("@/assets/images/eye-duotone.png")
      : require("@/assets/images/eyeclose-duotone.png");

  function handleErrorChangePassword(error: ApolloError) {
    const graphQLErrors = get(error, "graphQLErrors", []);
    if (error.graphQLErrors) {
      graphQLErrors.forEach((graphQLError) => {
        const code = get(graphQLError, "extensions.code", "") || "";
        const errors = (get(graphQLError, "extensions.errors", []) ||
          []) as any[];
        switch (code) {
          case YUP_VALIDATION_ERROR_TYPE:
            const errorlength = get(errors, "length", 0);
            if (errorlength > 0) {
              showSnackbar({
                title: "พบข้อผิดพลาด",
                message: `ไม่สามารถบันทึกได้ พบ ${errorlength} ข้อผิดพลาด`,
                type: DropdownType.Warn,
              });
            }
            forEach(errors, ({ path, ...message }) => setError(path, message));
            setFocus(get(errors, "0.path", ""));
            break;
          default:
            console.log(graphQLError);
            showSnackbar({
              title: "พบข้อผิดพลาด",
              message: graphQLError?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
              type: DropdownType.Warn,
            });
            break;
        }
      });
    } else {
      console.log("error: ", error);
      showSnackbar({
        title: "พบข้อผิดพลาด",
        message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
        type: DropdownType.Warn,
      });
    }
  }

  function handleChangePasswordSuccess() {
    showSnackbar({
      title: "สำเร็จ",
      message: "รหัสผ่านถูกเปลี่ยนแล้ว",
      type: DropdownType.Success,
    });
    if (requireAcceptedPolicy) {
      router.push("/readfirst");
    } else {
      router.push("/");
    }
  }

  async function onSubmit(values: ChangePasswordFormValue) {
    const encryptedPassword = encryption(values.password || "");
    const encryptedConfirmPassword = encryption(values.confirmPassword || "");
    changePassword({
      variables: {
        data: {
          password: encryptedPassword,
          confirmPassword: encryptedConfirmPassword,
        },
      },
      onCompleted: handleChangePasswordSuccess,
      onError: handleErrorChangePassword,
    });
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.contentContainer}>
          <View style={styles.headerWrapper}>
            <Iconify
              icon="solar:lock-password-unlocked-bold-duotone"
              color={colors.primary.main}
              size={normalize(56)}
            />
            <Text varient="h3" style={{ paddingTop: normalize(8) }}>
              เปลี่ยนรหัสผ่าน
            </Text>
            <Text varient="body2" color="secondary">
              เนื่องจากท่านเข้าสู่ระบบเป็นครั้งแรก
              จำเป็นต้องเปลี่ยนรหัสผ่านเพื่อความปลอดภัย
            </Text>
          </View>
          <FormProvider methods={methods} containerStyle={styles.inputWrapper}>
            <RHFTextInput
              name="password"
              label="รหัสผ่าน*"
              secureTextEntry={!openPassword}
              helperText={PassworHelperText}
              right={
                <TextInput.Icon
                  icon={eyeIcon(openPassword)}
                  forceTextInputFocus={false}
                  color={colors.text.secondary}
                  onPress={() => setOpenPassword(!openPassword)}
                />
              }
            />
            <RHFTextInput
              name="confirmPassword"
              label="ยืนยันรหัสผ่าน*"
              secureTextEntry={!openConfirmPassword}
              helperText={ConfirmPassworHelperText}
              right={
                <TextInput.Icon
                  icon={eyeIcon(openConfirmPassword)}
                  forceTextInputFocus={false}
                  color={colors.text.secondary}
                  onPress={() => setOpenConfirmPassword(!openConfirmPassword)}
                />
              }
            />
            <View style={styles.actionWrapper}>
              <Button
                fullWidth
                title="เปลี่ยนรหัสผ่าน"
                size="large"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
              />
            </View>
          </FormProvider>
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
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(16),
    paddingTop: normalize(24),
  },
  inputWrapper: {
    paddingHorizontal: normalize(16),
  },
  actionWrapper: {
    paddingVertical: normalize(32),
  },
  helperText: {
    marginTop: normalize(8),
    paddingLeft: normalize(12),
  },
});
