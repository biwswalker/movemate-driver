import NavigationBar from "@/components/NavigationBar";
import colors from "@/constants/colors";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { forEach, get, isEmpty } from "lodash";
import TextInput, { TextInputHandlesRef } from "@/components/TextInput";
import { normalize } from "@/utils/normalizeSize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  EDriverStatus,
  EUserStatus,
  useLookupDriverLazyQuery,
  User,
} from "@/graphql/generated/graphql";
import { ApolloError } from "@apollo/client";
import {
  EXISTING_DRIVER_PHONENUMBER,
  NOT_FOUND,
  EXISTING_PARENT,
} from "@/constants/error";
import Text from "@/components/Text";
import Iconify from "@/components/Iconify";
import { ActivityIndicator } from "react-native-paper";
import Button from "@/components/Button";
import { imagePath } from "@/utils/file";
import ConfirmEmployee, {
  ConfirmEmployeeModalRef,
} from "@/components/Modals/confirm-employee";
import NewEmployeeForm from "./form";

export default function NewEmployee() {
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const phoneInputRef = useRef<TextInputHandlesRef>(null);

  const [isDirty, setIsDirty] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const [existingUser, setExistingUser] = useState<User | undefined>(undefined);
  const [isExistingParent, setIsExistingParent] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean | undefined>(undefined);
  const [isReadyNext, setIsReadyNext] = useState<boolean | undefined>(
    undefined
  );

  const [lookupDriver, { loading }] = useLookupDriverLazyQuery({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    // ถ้ามีข้อมูล existingUser (หมายความว่าค้นหาเจอ) ให้ซ่อนคีย์บอร์ด
    if (existingUser) {
      if (phoneInputRef.current) {
        if (typeof phoneInputRef.current.blur === "function") {
          phoneInputRef.current.blur();
        }
      }
    }
  }, [existingUser]);

  function phonumberValidator(phonenumber: string) {
    const phonnumberRegex = new RegExp(/^(0[689]{1})+([0-9]{8})+$/);
    return phonnumberRegex.test(phonenumber);
  }

  function handleLookupError(error: ApolloError) {
    console.log("error: ", error);
    if (isEmpty(error.graphQLErrors)) {
      const message = get(error, "message", "");
      showSnackbar({
        message,
        title: "เกิดข้อผิดพลาด",
        type: DropdownType.Warn,
      });
    } else {
      forEach(error.graphQLErrors, (gqlError) => {
        const code = get(gqlError, "extensions.code", "");
        if (code === NOT_FOUND) {
          setIsNewUser(true);
          setExistingUser(undefined);
          setIsExistingParent(false);
        } else if (code === EXISTING_DRIVER_PHONENUMBER) {
          setPhoneNumberError("เบอร์ติดต่อซ้ำ");
          setIsNewUser(undefined);
          setExistingUser(undefined);
          setIsExistingParent(false);
        }
      });
    }
  }

  async function handleLookupPhonenumber(phonenumber: string) {
    await lookupDriver({
      variables: { phonenumber },
      fetchPolicy: "network-only",
      onError: handleLookupError,
      onCompleted: ({
        isExistingParentDriverByPhonenumber: isExisting,
        lookupDriverByPhonenumber: user,
      }) => {
        console.log("Lookup: userResponse", isExisting, user);
        if (user) {
          setIsNewUser(false);
          setExistingUser(user as User);
          setIsExistingParent(
            typeof isExisting === "boolean" ? isExisting : false
          );
        } else {
          setIsNewUser(true);
          setExistingUser(undefined);
          setIsExistingParent(false);
        }
      },
    });
  }

  const handleChangePhonenumber = (text: string) => {
    setPhoneNumberError("");
    setPhoneNumber(text);
    setExistingUser(undefined);
    setIsExistingParent(false);
    const validated = phonumberValidator(text);
    if (validated) {
      handleLookupPhonenumber(text);
      setIsReadyNext(true);
    } else {
      setIsReadyNext(false);
      if (isDirty) {
        setPhoneNumberError("เบอร์ติดต่อไม่ถูกต้อง");
      }
    }
  };

  const handleOnBlurPhonenumber = useCallback(() => {
    const validated = phonumberValidator(phoneNumber);
    setIsDirty(true);
    if (validated) {
      // handleLookupPhonenumber(phoneNumber);
    } else {
      setPhoneNumberError("เบอร์ติดต่อไม่ถูกต้อง");
    }
  }, [phoneNumber]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar title="เพิ่มคนขับ" />
        <KeyboardAwareScrollView
          style={styles.formWrapper}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          enableAutomaticScroll
          // extraHeight={-120}
          extraScrollHeight={120}
        >
          <TextInput
            ref={phoneInputRef}
            value={phoneNumber}
            onChangeText={handleChangePhonenumber}
            onBlur={handleOnBlurPhonenumber}
            label="เบอร์โทรศัพท์"
            error={!isEmpty(phoneNumberError)}
            helperText={phoneNumberError}
          />
          {isReadyNext && isEmpty(phoneNumberError) ? (
            loading ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="small" color={colors.text.secondary} />
              </View>
            ) : isNewUser ? (
              <NewEmployeeForm phoneNumber={phoneNumber} />
            ) : existingUser ? (
              <ExistingDriver user={existingUser} exist={isExistingParent} />
            ) : (
              <Fragment />
            )
          ) : (
            <PleasePutPhoneNumber />
          )}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
}

function PleasePutPhoneNumber() {
  return (
    <View style={styles.pppContainer}>
      <Iconify
        icon="solar:password-minimalistic-input-bold-duotone"
        color={colors.primary.main}
        size={normalize(64)}
      />
      <View style={styles.pppTextWrapper}>
        <Text color="secondary" style={styles.textCenter}>
          กรุณากรอกหมายเลขโทรศัพท์ผู้ขับรถ
        </Text>
        <Text color="secondary" style={styles.textCenter}>
          หากคนขับมีบัญชีอยู่แล้ว
        </Text>
        <Text color="secondary" style={styles.textCenter}>
          ท่านสามารถเพิ่มได้เลย
        </Text>
      </View>
    </View>
  );
}

interface ExistingDriverProps {
  user: User;
  exist: boolean;
}

function ExistingDriver({ user, exist }: ExistingDriverProps) {
  const modalRef = useRef<ConfirmEmployeeModalRef>(null);

  const handleConfirmAdd = useCallback(() => {
    if (modalRef.current) {
      modalRef.current.present();
    }
  }, []);

  const accountStatus = () => {
    switch (user.status) {
      case EUserStatus.ACTIVE:
        return { label: "ปกติ", color: colors.success.main };
      case EUserStatus.BANNED:
        return { label: "ห้ามใช้งาน", color: colors.error.main };
      case EUserStatus.DENIED:
        return { label: "ปฎิเสธบัญชี", color: colors.text.secondary };
      case EUserStatus.INACTIVE:
        return { label: "ระงับใช้งาน", color: colors.warning.darker };
      case EUserStatus.PENDING:
        return { label: "รอตรวจสอบบัญชี", color: colors.warning.main };
      default:
        return { label: "", color: colors.divider };
    }
  };

  const drivingStatus = () => {
    if (user.status === EUserStatus.ACTIVE) {
      switch (user.drivingStatus) {
        case EDriverStatus.IDLE:
          return { label: "ว่าง", color: colors.success.main };
        case EDriverStatus.WORKING:
          return { label: "ดำเนินการขนส่งอยู่", color: colors.info.main };
        case EDriverStatus.BUSY:
          return { label: "ไม่ว่าง", color: colors.warning.main };
        default:
          return { label: "", color: colors.divider };
      }
    } else {
      return { label: "-", color: colors.warning.main };
    }
  };

  const { color: statusColor, label: statusLabel } = accountStatus();
  const { color: drivingStatusColor, label: drivingStatusLabel } =
    drivingStatus();

  return (
    <Fragment>
      <View style={styles.itemContainer}>
        <View style={styles.driverInfoWrapper}>
          {user.profileImage ? (
            <Image
              style={[styles.profileImage]}
              source={{ uri: imagePath(user.profileImage?.filename) }}
            />
          ) : (
            <Iconify
              icon="solar:user-circle-bold-duotone"
              size={44}
              color={colors.text.disabled}
            />
          )}
          <View style={{ paddingLeft: 6 }}>
            <Text varient="body1">{user.fullname}</Text>
            <Text varient="body2" color="secondary">
              {user.contactNumber}
            </Text>
          </View>
        </View>
        <View style={styles.driverStatusWrapper}>
          <View style={styles.driverStatusTextWrapper}>
            <View style={styles.driverStatusText}>
              <Text varient="subtitle2">สถานะบัญชี</Text>
              <Text varient="body2" style={[{ color: statusColor }]}>
                {statusLabel}
              </Text>
            </View>
            <View style={styles.driverStatusText}>
              <Text varient="subtitle2">ประเภทรถ</Text>
              <Text varient="body2">
                {user.driverDetail?.serviceVehicleTypes
                  ?.map((vehicle) => vehicle.name)
                  ?.join(", ")}
              </Text>
            </View>
          </View>
          <View style={styles.driverWraningWrapper}>
            <Text varient="body2" color="secondary">
              เบอร์นี้มีบัญชีเป็นคนขับในระบบเราอยู่แล้ว
            </Text>
          </View>
          <Button
            title={exist ? "คุณเพิ่มคนขับคนนี้แล้ว" : "เพิ่มคนขับ"}
            color="primary"
            varient="soft"
            fullWidth
            disabled={exist}
            onPress={handleConfirmAdd}
            StartIcon={
              exist ? (
                <Fragment />
              ) : (
                <Iconify
                  icon="typcn:plus"
                  size={normalize(16)}
                  color={colors.primary.dark}
                />
              )
            }
          />
        </View>
      </View>
      <ConfirmEmployee user={user} ref={modalRef} />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  wrapper: { flex: 1 },
  loadingWrapper: {
    padding: normalize(24),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formWrapper: { flex: 1, marginHorizontal: normalize(16) },
  pppContainer: {
    alignItems: "center",
    paddingVertical: normalize(24),
    gap: normalize(12),
  },
  pppTextWrapper: { alignItems: "center" },
  textCenter: { textAlign: "center" },
  itemContainer: {
    padding: 8,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.common.white,
    gap: 16,
  },
  driverInfoWrapper: { flexDirection: "row", gap: normalize(4) },
  profileImage: { width: 44, height: 44, borderRadius: 22 },
  driverStatusWrapper: {
    backgroundColor: colors.grey[200],
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  driverStatusTextWrapper: { flexDirection: "row", flex: 1 },
  driverStatusText: { flex: 1 },
  driverWraningWrapper: { alignItems: "center", paddingTop: normalize(8) },
});
