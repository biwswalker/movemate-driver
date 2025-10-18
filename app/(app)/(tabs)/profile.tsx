import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Text, { getFontVarient } from "@components/Text";
import Iconify from "@components/Iconify";
import hexToRgba from "hex-to-rgba";
import { imagePath } from "@utils/file";
import { ScrollView } from "react-native-gesture-handler";
import colors from "@constants/colors";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  EUserStatus,
  FileInput,
  User,
  useUpdateProfileImageMutation,
} from "@/graphql/generated/graphql";
import Button from "@/components/Button";
import Label from "@/components/Label";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import * as ImagePicker from "expo-image-picker";
import { fileUploadAPI } from "@/services/upload";
import { get, includes, isNumber, pick } from "lodash";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Constants from "expo-constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 24,
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  infoTextContainer: {
    marginBottom: 24,
    flexGrow: 1,
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
  },
  infoTextWrapper: {
    backgroundColor: hexToRgba(colors.warning.main, 0.08),
    borderRadius: 8,
    padding: 16,
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    minWidth: 32,
  },
  infoText: {
    color: colors.warning.dark,
  },
  userInfoWrapper: {
    alignItems: "center",
  },
  userInfoTextWrapper: {
    paddingTop: 8,
    alignItems: "center",
  },
  menuWrapper: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: 72,
  },
  menuItemWrapper: {
    width: "100%",
  },
  versionText: {
    padding: 16,
    color: colors.text.disabled,
  },
});

export default function Profile() {
  const { user, refetchMe } = useAuth();
  const appVersion = Constants.expoConfig?.version;

  const { showSnackbar, DropdownType } = useSnackbarV2();
  const [openLogout, setOpenLogout] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();

  // 1. Add mutation for updating profile
  const [updateProfileImage, { loading: updateProfileImageLoading }] =
    useUpdateProfileImageMutation();

  function handleLogout() {
    setOpenLogout(true);
  }

  // 2. Function to handle image picking and uploading
  const handleUploadProfileImage = async (type: "CAMERA" | "GALLERY") => {
    let result: ImagePicker.ImagePickerResult;

    if (type === "CAMERA") {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
    } else {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
    }

    if (!result.canceled) {
      const file = result.assets[0];
      try {
        const response = await fileUploadAPI({
          uri: file.uri,
          name: file.fileName || `profile-${user?._id}.jpg`,
          type: file.mimeType || "image/jpeg",
        });

        const responseFile = get(response, "data", undefined);
        if (responseFile) {
          const profileImage = pick(responseFile, [
            "fileId",
            "filename",
            "mimetype",
          ]) as FileInput;

          // Call mutation to update profile
          updateProfileImage({
            variables: { fileDetail: profileImage, uid: user?._id },
            onCompleted: () => {
              showSnackbar({
                title: "สำเร็จ",
                message: "อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว",
                type: DropdownType.Success,
              });
              refetchMe(); // Refetch user data to show new image
            },
            onError: (error) => {
              showSnackbar({
                title: "เกิดข้อผิดพลาด",
                message: error.message || "ไม่สามารถอัปเดตรูปโปรไฟล์ได้",
                type: DropdownType.Error,
              });
            },
          });
        }
      } catch (error: any) {
        console.error("Upload failed:", error);
        showSnackbar({
          title: "อัปโหลดล้มเหลว",
          message: "กรุณาลองใหม่อีกครั้ง",
          type: DropdownType.Error,
        });
      }
    }
  };

  function handleOpenActionSheet() {
    // Note: Record called "utility type"
    const defaultMenu = [
      { label: "ถ่ายรูป", value: "CAMERA" },
      { label: "เลือกรูปจากแกลอรี่", value: "GALLERY" },
      { label: "ยกเลิก", value: "CANCEL" },
    ];

    showActionSheetWithOptions(
      {
        title: "เลือกไฟล์รูปภาพหรือเอกสาร",
        message: "กรุณาเลือกช่องทางนำเข้าไฟล์ เฉพาะไฟล์ รูปภาพ และ PDF",
        options: defaultMenu.map((option) => option.label),
        cancelButtonIndex: defaultMenu.length - 1,
        titleTextStyle: getFontVarient("h4"),
        messageTextStyle: {
          ...getFontVarient("body2"),
          color: colors.text.disabled,
        },
        textStyle: getFontVarient("buttonL"),
      },
      (selectedIndex: number | undefined) => {
        if (isNumber(selectedIndex)) {
          const pressMenu = defaultMenu[selectedIndex!];
          if (includes(["CAMERA", "GALLERY"], pressMenu.value)) {
            handleUploadProfileImage(pressMenu.value as any);
          }
        }
      }
    );
  }

  function getUserStatus(_user: User): { text: string; color: TColorSchema } {
    switch (_user.status) {
      case EUserStatus.ACTIVE:
        return { color: "success", text: "ใช้งานปกติ" };
      case EUserStatus.PENDING:
        return { color: "warning", text: "รอการอนุมัติ" };
      case EUserStatus.INACTIVE: // Susspended by admin
        return { color: "error", text: "ถูกระงับ" };
      case EUserStatus.BANNED:
        return { color: "error", text: "ห้ามใช้งาน" };
      case EUserStatus.DENIED:
        return { color: "error", text: "ปฏิเสธการอนุมัติ" };
      default:
        return { color: "inherit", text: "-" };
    }
  }

  return (
    <Fragment>
      <View style={styles.container}>
        <SafeAreaView style={styles.wrapper}>
          <ScrollView>
            <View style={styles.contentWrapper}>
              {user?.status === EUserStatus.PENDING && <PendingApproval />}
              <View style={styles.userInfoWrapper}>
                <TouchableOpacity onPress={handleOpenActionSheet}>
                  {user?.profileImage ? (
                    <Image
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: 44,
                      }}
                      source={{ uri: imagePath(user.profileImage.filename) }}
                    />
                  ) : (
                    <Iconify
                      icon="solar:user-circle-bold-duotone"
                      size={88}
                      color={colors.text.disabled}
                    />
                  )}
                </TouchableOpacity>
                {user && (
                  <View style={styles.userInfoTextWrapper}>
                    <Text varient="h5">{user?.fullname}</Text>
                    <Text varient="body2" color="secondary">
                      {user?.username}
                    </Text>
                    <View style={{ alignSelf: "center", paddingTop: 4 }}>
                      <Label
                        text={getUserStatus(user).text}
                        color={getUserStatus(user).color}
                      />
                    </View>
                  </View>
                )}
              </View>
              <View style={[styles.menuWrapper]}>
                <Text
                  varient="body2"
                  color="secondary"
                  style={[{ paddingHorizontal: 16 }]}
                >
                  ตั้งค่าโปรไฟล์
                </Text>
                <View style={styles.menuItemWrapper}>
                  <Item
                    label="ข้อมูลส่วนตัว"
                    onPress={() => router.push("/profile-detail")}
                  />
                  <Item
                    label="ข้อมูลเอกสาร"
                    onPress={() => router.push("/profile-document")}
                  />
                  <Item
                    label="งานขนส่ง/แจ้งเตือน"
                    onPress={() => router.push("/profile-setting")}
                  />
                </View>
                <Text
                  varient="body2"
                  color="secondary"
                  style={[
                    {
                      paddingHorizontal: 16,
                      paddingTop: 16,
                    },
                  ]}
                >
                  ข้อกำหนด
                </Text>
                <View style={styles.menuItemWrapper}>
                  <Item
                    label="ข้อกำหนดการให้บริการ"
                    onPress={() => router.push("/profile-policy")}
                  />
                </View>
                <View
                  style={{
                    alignItems: "flex-start",
                    paddingHorizontal: 16,
                    paddingTop: 16,
                  }}
                >
                  <TouchableOpacity onPress={handleLogout}>
                    <Text varient="body1" style={{ color: colors.error.main }}>
                      ลงชื่อออก
                    </Text>
                  </TouchableOpacity>
                </View>
                {appVersion && (
                  <Text
                    varient="body2"
                    color="disabled"
                    style={styles.versionText}
                  >
                    เวอร์ชั่น {appVersion}
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
      <ConfirmDialog open={openLogout} setOpen={setOpenLogout} />
    </Fragment>
  );
}

function PendingApproval() {
  return (
    <View style={styles.infoTextContainer}>
      <View style={styles.infoTextWrapper}>
        <Iconify
          icon="iconoir:warning-circle-solid"
          size={18}
          color={colors.warning.dark}
          style={styles.iconWrapper}
        />
        <Text varient="body2" style={styles.infoText}>
          บัญชีของคุณรอการตรวจสอบจากผู้ดูแล
        </Text>
      </View>
    </View>
  );
}

const itemStyled = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});

interface ItemProps {
  label: string;
  onPress: Function;
}

function Item({ onPress, label }: ItemProps) {
  function handleOnPress() {
    onPress();
  }
  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View style={itemStyled.wrapper}>
        <Text varient="body1">{label}</Text>
        <Iconify
          icon="mi:chevron-right"
          size={16}
          color={colors.text.primary}
        />
      </View>
    </TouchableOpacity>
  );
}

interface IConfirmDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function ConfirmDialog({ open, setOpen }: IConfirmDialogProps) {
  const { logout } = useAuth();

  const handleClose = () => {
    setOpen(false);
  };

  function handleConfirmed() {
    logout();
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={handleClose}
    >
      <View style={modalStyle.container}>
        <View style={modalStyle.wrapper}>
          <View style={modalStyle.titleWrapper}>
            <Text varient="h4">ออกจากระบบ</Text>
          </View>
          <View style={modalStyle.detailWrapper}>
            <Text>คุณแน่ใจหรือไม่ว่าจะลงชื่อออก?</Text>
          </View>
          <View style={modalStyle.actionWrapper}>
            <Button
              varient="soft"
              size="large"
              fullWidth
              color="inherit"
              title="ลงชื่ออก"
              onPress={handleConfirmed}
            />
            <Button
              varient="contained"
              color="primary"
              size="large"
              fullWidth
              title="อยู่ต่อ"
              onPress={handleClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyle = StyleSheet.create({
  container: {
    backgroundColor: hexToRgba(colors.common.black, 0.32),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  wrapper: {
    backgroundColor: colors.common.white,
    overflow: "hidden",
    borderRadius: 16,
    width: "100%",
    padding: 16,
  },
  actionWrapper: {
    gap: 8,
    flexDirection: "row",
  },
  titleWrapper: {
    marginBottom: 16,
  },
  detailWrapper: {
    marginBottom: 24,
  },
});
