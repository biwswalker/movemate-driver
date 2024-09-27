import { ProgressingStepsProps } from "./ProgressingStep";
import { ScrollView, StyleSheet, View } from "react-native";
import { normalize } from "@/utils/normalizeSize";
import Text from "@/components/Text";
import { filter, get, isUndefined, map, pick, pullAt } from "lodash";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { DropdownAlertType } from "react-native-dropdownalert";
import {
  useNextShipmentStepMutation,
  FileInput as FileInputGraph,
} from "@/graphql/generated/graphql";
import Button from "@/components/Button";
import { useState } from "react";
import { fileUploadAPI } from "@/services/upload";
import UploadButton from "@/components/UploadButton";
import { imagePath } from "@/utils/file";

export function ProgressPickAndDrop({
  shipment,
  refetch,
  step,
}: ProgressingStepsProps) {
  const { showSnackbar } = useSnackbarV2();
  const [nextShipmentStep, { loading }] = useNextShipmentStepMutation();
  const [files, setFiles] = useState<(FileInput | undefined)[]>([undefined]);

  function handleConfirmComplete() {
    refetch();
  }

  function handleConfirmError(error: ApolloError) {
    const message = error.message || "พบข้อผิดพลาด";
    showSnackbar({
      message,
      title: "พบข้อผิดพลาด",
      type: DropdownAlertType.Error,
    });
  }

  async function reformUpload(
    file: FileInput
  ): Promise<FileInputGraph | undefined> {
    try {
      if (file) {
        const response = await fileUploadAPI({
          name: file.name,
          type: file.trueType || "",
          uri: file.uri,
        });
        const responseFile = get(response, "data", undefined);
        return pick(responseFile, [
          "fileId",
          "filename",
          "mimetype",
        ]) as FileInputGraph;
      }
      return undefined;
    } catch (error) {
      console.log("Upload error: ", JSON.stringify(error));
      return undefined;
    }
  }

  async function handleConfirm() {
    const usedFiles = files.filter((file) => !isUndefined(file));
    if (usedFiles.length > 1) {
      const images = await Promise.all(
        map(usedFiles, (file) => reformUpload(file))
      );
      console.log(
        "requerrrr",
        JSON.stringify(images.filter((file) => !isUndefined(file)))
      );
      nextShipmentStep({
        variables: {
          data: {
            shipmentId: shipment._id,
            images: images.filter((file) => !isUndefined(file)),
          },
        },
        onCompleted: handleConfirmComplete,
        onError: handleConfirmError,
      });
    } else {
      const message = "ไม่สามารถยืนยันขึ้นสินค้าได้ กรุณาแนบรูปขึ้นต่ำ 2 รูป";
      showSnackbar({
        message,
        title: "พบข้อผิดพลาด",
        type: DropdownAlertType.Warn,
      });
    }
  }

  function handleFileChange(file: FileInput, index: number) {
    let uploadedFile = [...files];
    uploadedFile[index] = file;
    if (uploadedFile.length < 3) {
      uploadedFile[index + 1] = undefined;
    }
    setFiles(uploadedFile);
  }
  function handleFileRemove(index: number) {
    let uploadedFile = [...files];
    pullAt(uploadedFile, [index]);
    if (filter(uploadedFile, isUndefined).length < 1) {
      uploadedFile = [...uploadedFile, undefined];
    }
    setFiles(uploadedFile);
  }

  return (
    <ScrollView style={progressStyles.wrapper}>
      {/* Direction detail */}
      <Text varient="body2" color="secondary">
        ยืนยันโดยรูปถ่าย
      </Text>
      <View style={progressStyles.contactWrapper}>
        {map(files, (file, index) => {
          return (
            <UploadButton
              key={`${file?.name}-${index}`}
              file={file}
              actionMenus={["CAMERA", "GALLERY"]}
              onFileChange={(file) => handleFileChange(file, index)}
              onRemove={() => handleFileRemove(index)}
              isImagePreview
              containerStyle={{ maxWidth: normalize(88) }}
            />
          );
        })}
      </View>
      <View style={progressStyles.actionsWrapper}>
        <Button
          size="large"
          title={`ยืนยัน${step.driverMessage}`}
          fullWidth
          disabled={files.length < 1}
          loading={loading}
          onPress={handleConfirm}
        />
      </View>
    </ScrollView>
  );
}

export function DonePickAndDrop({ step }: ProgressingStepsProps) {
  return (
    <View style={progressStyles.wrapper}>
      <Text varient="body2" color="secondary">
        ยืนยันโดยรูปถ่าย
      </Text>
      <View style={progressStyles.contactWrapper}>
        {map(step.images, (file, index) => {
          return (
            <UploadButton
              key={`${file?._id}-${index}`}
              file={imagePath(file.filename)}
              disabled
              isImagePreview
              containerStyle={{ maxWidth: normalize(88) }}
            />
          );
        })}
      </View>
    </View>
  );
}

const progressStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(16),
    gap: normalize(2),
  },
  contactWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: normalize(8),
    paddingTop: normalize(2),
  },
  actionsWrapper: {
    paddingTop: normalize(24),
  },
});
