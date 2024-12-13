import { ProgressingStepsProps } from "./ProgressingStep";
import { Image, StyleSheet, View } from "react-native";
import { normalize } from "@/utils/normalizeSize";
import Text from "@/components/Text";
import { filter, get, includes, isUndefined, map, pick, pullAt } from "lodash";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { DropdownAlertType } from "react-native-dropdownalert";
import {
  useNextShipmentStepMutation,
  FileInput as FileInputGraph,
  StepDefinition,
  EStepDefinition,
  EShipmentStatus,
} from "@/graphql/generated/graphql";
import Button from "@/components/Button";
import { Fragment, useState } from "react";
import { fileUploadAPI } from "@/services/upload";
import UploadButton from "@/components/UploadButton";
import { imagePath } from "@/utils/file";

interface ProgressPickAndDropProps extends ProgressingStepsProps {
  definition: StepDefinition | undefined;
}

export function ProgressPickAndDrop({
  shipment,
  refetch,
  step,
  definition,
}: ProgressPickAndDropProps) {
  const [isLoading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbarV2();
  const [nextShipmentStep, { loading }] = useNextShipmentStepMutation();
  const [files, setFiles] = useState<(FileInput | undefined)[]>([undefined]);

  function handleConfirmComplete() {
    refetch();
  }

  function handleConfirmError(error: ApolloError) {
    setLoading(false)
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
      setLoading(true)
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
    <View style={styles.wrapper}>
      {/* Direction detail */}
      <Text varient="body2" color="secondary">
        {definition?.step === EStepDefinition.PICKUP
          ? "รูปภาพตอนขึ้นสินค้า"
          : definition?.step === EStepDefinition.DROPOFF
            ? "รูปภาพตอนลงสินค้า"
            : ""}
      </Text>
      <View style={styles.contactWrapper}>
        {map(files, (file, index) => {
          return (
            <UploadButton
              key={`${file?.name}-${index}`}
              file={file}
              actionMenus={["CAMERA", "GALLERY"]}
              onFileChange={(file) => handleFileChange(file, index)}
              onRemove={() => handleFileRemove(index)}
              isImagePreview
              containerStyle={{
                maxWidth: normalize(88),
              }}
            />
          );
        })}
      </View>
      <View style={styles.actionsWrapper}>
        <Button
          size="large"
          varient="soft"
          title={`ยืนยัน${definition?.driverMessage}`}
          fullWidth
          disabled={files.length < 1}
          loading={isLoading}
          onPress={handleConfirm}
        />
      </View>
    </View>
  );
}

export function DonePickAndDrop({ definition, shipment }: ProgressPickAndDropProps) {
  const isHiddenInfo = includes(
    [
      EShipmentStatus.DELIVERED,
      EShipmentStatus.CANCELLED,
      EShipmentStatus.REFUND,
    ],
    shipment?.status
  );
  if(isHiddenInfo) {
    return <Fragment />
  }
  return (
    <View style={styles.wrapper}>
      <Text varient="body2" color="secondary">
        {definition?.step === EStepDefinition.PICKUP
          ? "รูปภาพตอนขึ้นสินค้า"
          : definition?.step === EStepDefinition.DROPOFF
            ? "รูปภาพตอนลงสินค้า"
            : ""}
      </Text>
      <View style={styles.contactWrapper}>
        {map(definition?.images, (file, index) => (
          <Image
            key={`image-${file._id}-${index}`}
            style={[styles.imageStyle]}
            source={{ uri: imagePath(file.filename) }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(16),
    gap: normalize(2),
  },
  contactWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: normalize(8),
    paddingTop: normalize(8),
    height: normalize(88),
  },
  actionsWrapper: {
    paddingTop: normalize(24),
  },
  imageStyle: {
    aspectRatio: 1,
    flex: 1,
    maxWidth: normalize(88),
    resizeMode: "cover",
  },
});
