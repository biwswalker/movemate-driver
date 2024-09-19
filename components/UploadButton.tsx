import hexToRgba from "hex-to-rgba";
import React, { Fragment, useRef } from "react";
import { StyleSheet, View, ViewStyle, TouchableOpacity } from "react-native";
import { Iconify } from "react-native-iconify";
import Text, { getFontVarient } from "./Text";
import { fData } from "@utils/number";
import { fileData, fileFormat } from "@utils/file";
import { get, isEmpty, isNumber, map, pull } from "lodash";
import FlexImage from "react-native-flex-image";
import ButtonIcon from "@components/ButtonIcon";
import colors from "@/constants/colors";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 4,
  },
  wrapperImage: {
    flex: 1,
    padding: 24,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    borderColor: colors.primary.main,
    backgroundColor: hexToRgba(colors.primary.lighter, 0.1),
  },
  wrapper: {
    flex: 1,
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderColor: colors.divider,
    overflow: "hidden",
  },
  wrapperError: {
    borderColor: colors.error.main,
    backgroundColor: hexToRgba(colors.error.lighter, 0.1),
  },
  labelStyle: {
    alignSelf: "center",
  },
  imageStyle: {
    aspectRatio: 1,
    flex: 1,
    resizeMode: "cover",
  },
  textDestWrapper: {
    flex: 1,
    paddingRight: 0,
    overflow: "hidden",
  },
  removeOnImagePreview: {
    position: "absolute",
    right: 8,
    top: 8,
  },
  actionSheetContainer: {
    padding: 24,
    paddingBottom: 48,
    gap: 8,
  },
  actionSheetTitle: {
    paddingBottom: 16,
  },
  actionSheetButton: {
    padding: 16,
    alignItems: "center",
  },
  cancelText: {
    color: "red",
  },
});

interface MenuAction {
  label: string;
  value: ActionType;
}
type ActionType = "CAMERA" | "FILE" | "GALLERY" | "CANCEL";
type DefaultActions = Record<ActionType, MenuAction>;

export interface UploadButtonProps {
  containerStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  label?: string;
  placeholder?: string;
  isImagePreview?: boolean;
  file?: FileInput | string;
  onFileChange?: (file: FileInput) => void;
  error?: boolean;
  helperText?: string;
  onRemove?: () => void;
  disabled?: boolean;
  actionMenus?: ActionType[];
}

export default function UploadButton({
  containerStyle,
  buttonStyle,
  label,
  placeholder = "ยังไม่ได้อัพโหลด",
  isImagePreview = false,
  file: inputFile,
  onFileChange = () => {},
  error,
  onRemove,
  helperText,
  disabled,
  actionMenus = ["CAMERA", "FILE", "GALLERY", "CANCEL"],
}: UploadButtonProps) {
  const { showActionSheetWithOptions } = useActionSheet();

  const { name, size, uri } = fileData(inputFile || "");

  async function handleSelectedImage(
    response:
      | ImagePicker.ImagePickerResult
      | DocumentPicker.DocumentPickerResult
  ) {
    if (response.canceled) {
      console.log("User cancelled camera");
    } else {
      const asset = get(response, "assets.0", undefined) as
        | ImagePicker.ImagePickerAsset
        | undefined;
      if (asset) {
        const fileUri = get(asset, "uri", "");
        const fileSize = get(asset, "fileSize", 0);
        const fileTrueType = get(asset, "mimeType", "") || "";
        const extension = fileUri.split(".").pop();
        const fileName =
          get(asset, "fileName", `unnamed.${extension}`) ||
          `unnamed.${extension}`;
        const copyUriFile = await moveFile(fileUri);
        const fileType = fileFormat(copyUriFile);
        const source: FileInput = {
          uri: copyUriFile,
          name: fileName,
          size: fileSize,
          type: fileType,
          trueType: fileTrueType,
        };
        console.log("source", source);
        onFileChange(source);
      }
    }
  }

  async function moveFile(fileUri: string) {
    const newLocation = `${FileSystem.documentDirectory}${fileUri.split("/").pop()}`;
    await FileSystem.copyAsync({
      from: fileUri,
      to: newLocation,
    });
    return newLocation;
  }

  async function handleSelectFile() {
    const pickFile = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
    });
    handleSelectedImage(pickFile);
  }

  async function handleChoosePhoto() {
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.6,
    });
    handleSelectedImage(image);
  }

  async function handleTakePhoto() {
    const image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.6,
    });
    handleSelectedImage(image);
  }

  function handleOpenActionSheet() {
    if (disabled) return;
    // Note: Record called "utility type"
    const defaultMenu: DefaultActions = {
      CAMERA: { label: "ถ่ายรูป", value: "CAMERA" },
      FILE: { label: "เลือกจากไฟล์", value: "FILE" },
      GALLERY: { label: "เลือกรูปจากแกลอรี่", value: "GALLERY" },
      CANCEL: { label: "ยกเลิก", value: "CANCEL" },
    };
    const preOptions = pull(actionMenus, "CANCEL")
      .concat("CANCEL")
      .map((menu) => defaultMenu[menu]);
    const cancelButtonIndex = preOptions.length - 1;

    showActionSheetWithOptions(
      {
        title: "เลือกไฟล์รูปภาพหรือเอกสาร",
        message: "กรุณาเลือกช่องทางนำเข้าไฟล์ เฉพาะไฟล์ รูปภาพ และ PDF",
        options: preOptions.map((option) => option.label),
        cancelButtonIndex,
        titleTextStyle: getFontVarient("h4"),
        messageTextStyle: {
          ...getFontVarient("body2"),
          color: colors.text.disabled,
        },
        textStyle: getFontVarient("buttonL"),
        // containerStyle,
      },
      (selectedIndex: number | undefined) => {
        if (isNumber(selectedIndex)) {
          const pressMenu: MenuAction = preOptions[selectedIndex!];
          switch (pressMenu.value) {
            case "CAMERA":
              handleTakePhoto();
              break;
            case "FILE":
              handleSelectFile();
              break;
            case "GALLERY":
              handleChoosePhoto();
              break;
            case "CANCEL":
            // Canceled
          }
        }
      }
    );
  }

  if (isImagePreview) {
    return (
      <>
        <View style={[styles.container, containerStyle]}>
          {uri ? (
            <View
              style={[
                styles.wrapperImage,
                error && styles.wrapperError,
                [{ padding: 0 }],
              ]}
            >
              <FlexImage style={[styles.imageStyle]} source={{ uri }} />
              {typeof onRemove === "function" && !disabled && uri && (
                <View style={[styles.removeOnImagePreview]}>
                  <ButtonIcon
                    varient="soft"
                    size="small"
                    color="inherit"
                    onPress={onRemove}
                  >
                    <Iconify
                      icon="mi:close"
                      size={24}
                      color={colors.common.white}
                    />
                  </ButtonIcon>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity onPress={handleOpenActionSheet}>
              <View
                style={[
                  styles.wrapperImage,
                  buttonStyle,
                  error && styles.wrapperError,
                ]}
              >
                <Iconify
                  icon="basil:plus-solid"
                  size={24}
                  color={error ? colors.error.main : colors.primary.main}
                />
              </View>
            </TouchableOpacity>
          )}
          {label && (
            <Text
              varient="caption"
              style={[styles.labelStyle, error && { color: colors.error.main }]}
            >
              {error && !isEmpty(helperText) ? helperText : label}
            </Text>
          )}
        </View>
      </>
    );
  }

  if (uri) {
    const ImageIcon = fileThumb(uri);
    return (
      <View style={[styles.container, containerStyle]}>
        <View
          style={[styles.wrapper, buttonStyle, error && styles.wrapperError]}
        >
          {ImageIcon}
          <View style={[styles.textDestWrapper]}>
            {label && <Text varient="body2">{label}</Text>}
            <Fragment>
              {/* <Text
                varient="caption"
                color="disabled"
                numberOfLines={1}
                ellipsizeMode="head"
                style={[error && { color: colors.error.main }]}
              >
                {error && !isEmpty(helperText) ? helperText : name}
              </Text> */}
              <Text
                varient="caption"
                color="disabled"
                numberOfLines={1}
                ellipsizeMode="head"
                style={[error && { color: colors.error.main }]}
              >
                {error && !isEmpty(helperText)
                  ? helperText
                  : size > 0
                    ? fData(size)
                    : ""}
              </Text>
              {/* {size > 0 && (
                <Text varient="caption" color="disabled">
                  {fData(size)}
                </Text>
              )} */}
            </Fragment>
          </View>
          {typeof onRemove === "function" && !disabled && uri && (
            <ButtonIcon varient="text" size="small" onPress={onRemove}>
              <Iconify icon="mi:close" size={24} color={colors.action.active} />
            </ButtonIcon>
          )}
        </View>
      </View>
    );
  }
  return (
    <>
      <View style={[styles.container, containerStyle]}>
        <TouchableOpacity onPress={handleOpenActionSheet}>
          <View
            style={[styles.wrapper, buttonStyle, error && styles.wrapperError]}
          >
            <Iconify
              icon="solar:file-bold-duotone"
              size={40}
              color={colors.text.secondary}
            />
            <View style={[styles.textDestWrapper]}>
              {label && <Text varient="body2">{label}</Text>}
              <Text
                varient="caption"
                color="disabled"
                style={[error && { color: colors.error.main }]}
              >
                {error && !isEmpty(helperText) ? helperText : placeholder}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

export function fileThumb(fileUrl: string) {
  switch (fileFormat(fileUrl)) {
    case "folder":
      return <Iconify icon="vscode-icons:default-folder" size={40} />;
    case "txt":
      return <Iconify icon="vscode-icons:folder-type-docs" size={40} />;
    case "zip":
      return <Iconify icon="vscode-icons:file-type-zip" size={40} />;
    case "audio":
      return <Iconify icon="catppuccin:audio" size={40} />;
    case "video":
      return <Iconify icon="vscode-icons:file-type-video" size={40} />;
    case "word":
      return <Iconify icon="vscode-icons:file-type-word" size={40} />;
    case "excel":
      return <Iconify icon="vscode-icons:file-type-excel" size={40} />;
    case "powerpoint":
      return <Iconify icon="vscode-icons:file-type-powerpoint" size={40} />;
    case "pdf":
      return <Iconify icon="vscode-icons:file-type-pdf2" size={40} />;
    case "photoshop":
      return <Iconify icon="skill-icons:photoshop" size={40} />;
    case "illustrator":
      return <Iconify icon="skill-icons:illustrator" size={40} />;
    case "image":
      return <Iconify icon="flat-color-icons:image-file" size={40} />;
    default:
      return <Iconify icon="flat-color-icons:file" size={40} />;
  }
}
