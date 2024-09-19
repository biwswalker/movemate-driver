import useAuth from "@/hooks/useAuth";
import Yup from "@/utils/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import colors from "@constants/colors";
import { normBaseW } from "@/utils/normalizeSize";
import hexToRgba from "hex-to-rgba";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import FormProvider from "@/components/HookForm/FormProvider";
import Iconify from "@/components/Iconify";
import RHFTextInput from "@/components/HookForm/RHFTextInput";
import { TextInput } from "react-native-paper";
import Button from "@/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginFormValue {
  username: string;
  password: string;
  afterSubmit?: string;
}

export default function Login() {
  // const { reset: resetNavigate } = useNavigation();
  const { login, loading, authError, clearAuthError } = useAuth();
  const [openEye, setOpenEye] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("ระบุเบอร์ที่ใช้ลงทะเบียน"),
    password: Yup.string().required("ระบุรหัสผ่าน"),
    afterSubmit: Yup.string(),
  });

  const defaultValues: LoginFormValue = {
    username: "",
    password: "",
  };

  const methods = useForm<LoginFormValue>({
    resolver: yupResolver(LoginSchema) as any,
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  useEffect(() => {
    return () => {
      clearAuthError();
      reset();
    };
  }, []);

  useEffect(() => {
    if (authError) {
      setError("afterSubmit", {
        message: authError.message,
        type: "validate",
      });
    }
  }, [authError, setError]);

  function handleRegister() {
    router.push("/register");
  }

  async function onSubmit({ afterSubmit: _, ...values }: LoginFormValue) {
    try {
      login(values);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const eyeIcon = openEye
    ? require("@/assets/images/eye-duotone.png")
    : require("@/assets/images/eyeclose-duotone.png");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container]}>
        <NavigationBar />
        <View style={styles.headerWrapper}>
          <Text varient="h3">{`สวัสดี,\nยินดีต้อนรับกลับ!`}</Text>
          <Text varient="body2" color="disabled">
            เข้าสู่ระบบของบัญชีของท่าน
          </Text>
        </View>
        <FormProvider methods={methods} containerStyle={styles.formContainer}>
          <View style={styles.formWrapper}>
            {errors.afterSubmit && errors.afterSubmit.message && (
              <View style={styles.errorContainer}>
                <Iconify
                  icon="ic:twotone-error"
                  width={24}
                  color={colors.error.dark}
                />
                <Text style={styles.errorText}>
                  {errors.afterSubmit.message}
                </Text>
              </View>
            )}
            <RHFTextInput
              name="username"
              label="เบอร์ที่ใช้ลงทะเบียน"
              left={
                <TextInput.Icon
                  icon={require("@/assets/images/user-duotone.png")}
                  color={colors.text.secondary}
                  forceTextInputFocus={false}
                  focusable={false}
                  disabled
                />
              }
            />
            <RHFTextInput
              name="password"
              label="รหัสผ่าน"
              secureTextEntry={!openEye}
              left={
                <TextInput.Icon
                  icon={require("@/assets/images/lock-duotone.png")}
                  color={colors.text.secondary}
                  forceTextInputFocus={false}
                  focusable={false}
                  disabled
                />
              }
              right={
                <TextInput.Icon
                  icon={eyeIcon}
                  forceTextInputFocus={false}
                  color={colors.text.secondary}
                  onPress={() => setOpenEye(!openEye)}
                />
              }
            />
          </View>
          <View style={styles.forgotpasswordWrapper}>
            <Button
              title="ลืมรหัสผ่าน?"
              varient="text"
              size="medium"
              color="master"
            />
          </View>
          <Button
            title="เข้าสู่ระบบ"
            fullWidth
            size="large"
            color="master"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
          />
          <View style={styles.footerSection}>
            <View style={[styles.rowWrapper, styles.backEditTextsWrapper]}>
              <Text varient="body2" color="disabled">
                ไม่มีบัญชีสมาชิกใช่ใหม?
              </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text varient="body2" style={styles.editTextButton}>
                  สมัครสมาชิก
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </FormProvider>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  headerWrapper: {
    paddingHorizontal: 32,
  },
  contentWrapper: {
    marginTop: 48,
    gap: 12,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 32,
  },
  formWrapper: {
    paddingTop: normBaseW(48),
  },
  footerSection: {},
  rowWrapper: {
    flexDirection: "row",
    paddingTop: 16,
    paddingBottom: 32,
    gap: 8,
  },
  backEditTextsWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  editTextButton: {
    color: colors.master.main,
    textAlign: "justify",
  },
  forgotpasswordWrapper: {
    paddingVertical: 16,
    alignItems: "flex-end",
  },
  errorContainer: {
    backgroundColor: hexToRgba(colors.error.main, 0.1),
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    gap: 8,
  },
  errorText: {
    color: colors.error.darker,
    flexWrap: "wrap",
  },
});
