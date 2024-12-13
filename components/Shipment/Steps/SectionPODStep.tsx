import { ProgressingStepsProps } from "./ProgressingStep";
import { Image, StyleSheet, View } from "react-native";
import { normalize } from "@/utils/normalizeSize";
import Text from "@/components/Text";
import {
  filter,
  get,
  head,
  includes,
  isUndefined,
  map,
  pick,
  pullAt,
} from "lodash";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { DropdownAlertType } from "react-native-dropdownalert";
import {
  EShipmentStatus,
  FileInput as FileInputGraph,
  useSentPodDocumentMutation,
} from "@/graphql/generated/graphql";
import Button from "@/components/Button";
import { Fragment, useRef, useState } from "react";
import { fileUploadAPI } from "@/services/upload";
import UploadButton from "@/components/UploadButton";
import { imagePath } from "@/utils/file";
import SelectDropdown from "@/components/SelectDropdown";
import TextInput from "@/components/TextInput";
import { censorText } from "@/utils/string";
import Animated from "react-native-reanimated";

const SENDER_PROVIDER = [
  { value: "ไปรษณีย์ไทย", label: "ไปรษณีย์ไทย" },
  { value: "Kerry Express", label: "Kerry Express" },
  { value: "Best Express", label: "Best Express" },
  { value: "Ninja Van", label: "Ninja Van" },
  { value: "J&T Express", label: "J&T Express" },
  { value: "Flash Express", label: "Flash Express" },
  { value: "SCG Express", label: "SCG Express" },
  { value: "DHL Express", label: "DHL Express" },
  { value: "LALAMOVE", label: "LALAMOVE" },
  { value: "Deliveree", label: "Deliveree" },
];

export function ProgressPOD({
  shipment,
  refetch,
  step,
}: ProgressingStepsProps) {
  const { showSnackbar } = useSnackbarV2();
  const [sentPODDocument, { loading }] = useSentPodDocumentMutation();

  const [files, setFiles] = useState<(FileInput | undefined)[]>([undefined]);
  const [provider, setProvider] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const definition = head(step.definitions);

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
      console.log("Upload error: ", error);
      return undefined;
    }
  }

  async function handleConfirm() {
    const usedFiles = files.filter((file) => !isUndefined(file));
    if (!provider) {
      const message = "กรุณาเลือกผู้ให้บริการ";
      showSnackbar({
        message,
        title: "ข้อมูลไม่ครบ",
        type: DropdownAlertType.Warn,
      });
      return;
    }
    if (!trackingNumber) {
      const message = "กรุณากรอกหมายเลขติดตาม";
      showSnackbar({
        message,
        title: "ข้อมูลไม่ครบ",
        type: DropdownAlertType.Warn,
      });
      return;
    }
    if (usedFiles.length > 0) {
      const images = await Promise.all(
        map(usedFiles, (file) => reformUpload(file))
      );
      sentPODDocument({
        variables: {
          data: {
            provider,
            trackingNumber,
            shipmentId: shipment._id,
            images: images.filter((file) => !isUndefined(file)),
          },
        },
        onCompleted: handleConfirmComplete,
        onError: handleConfirmError,
      });
    } else {
      const message = "ไม่สามารถยืนยันขึ้นสินค้าได้ กรุณาแนบรูปขึ้นต่ำ 1 รูป";
      showSnackbar({
        message,
        title: "ข้อมูลไม่ครบ",
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
    <Fragment>
      <Animated.ScrollView style={styles.wrapper}>
        {/* Direction detail */}
        <Text varient="body2" color="secondary">
          รูปภาพหลักฐานการส่ง
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
                podPreparation={index === 0}
                containerStyle={{ maxWidth: normalize(88) }}
              />
            );
          })}
        </View>
        <View>
          <SelectDropdown
            label="บริษัทขนส่ง"
            options={SENDER_PROVIDER}
            labelField="label"
            valueField="value"
            value={provider}
            dropdownPosition="top"
            onChanged={(provider) => {
              setProvider(provider.value);
            }}
          />
          <TextInput
            label="หมายเลขติดตาม"
            value={trackingNumber}
            onChangeText={(text) => {
              setTrackingNumber(text);
            }}
          />
        </View>
        <View style={styles.actionsWrapper}>
          <Button
            size="large"
            varient="soft"
            title={`ยืนยัน${definition?.driverMessage}`}
            fullWidth
            loading={loading}
            onPress={handleConfirm}
          />
        </View>
      </Animated.ScrollView>
    </Fragment>
  );
}

export function DonePOD({ step, shipment }: ProgressingStepsProps) {
  const definition = head(step.definitions);
  const podDetail = shipment.podDetail;
  const isHiddenInfo = includes(
    [
      EShipmentStatus.DELIVERED,
      EShipmentStatus.CANCELLED,
      EShipmentStatus.REFUND,
    ],
    shipment?.status
  );
  return (
    <View style={styles.wrapper}>
      {!isHiddenInfo && (
        <Fragment>
          <Text varient="body2" color="disabled">
            รูปภาพหลักฐานการส่ง
          </Text>
          <View style={styles.contactWrapper}>
            {map(definition?.images || [], (file, index) => {
              return (
                <Image
                  key={`image-${file._id}-${index}`}
                  style={[styles.imageStyle]}
                  source={{ uri: imagePath(file.filename) }}
                />
              );
            })}
          </View>
        </Fragment>
      )}
      {podDetail && (
        <View style={styles.addressContent}>
          <Text varient="body2" color="disabled">
            ที่อยู่
          </Text>
          <Text varient="body2">
            {isHiddenInfo
              ? "********"
              : `${podDetail.address} แขวง/ตำบล ${podDetail.subDistrict} เขต/อำเภอ{" "}
            ${podDetail.district} จังหวัด ${podDetail.province}{" "}
            ${podDetail.postcode}`}
          </Text>
          <Text varient="body2" color="disabled" style={styles.title}>
            หมายเลขติดต่อ
          </Text>
          <Text varient="body2">
            {isHiddenInfo
              ? censorText(podDetail.phoneNumber)
              : podDetail.phoneNumber}
          </Text>
          <Text varient="body2" color="disabled" style={styles.title}>
            ผู้ให้บริการ
          </Text>
          <Text varient="body2">{podDetail.provider || "-"}</Text>
          <Text varient="body2" color="disabled" style={styles.title}>
            หมายเลขติดตาม
          </Text>
          <Text varient="body2">
            {isHiddenInfo
              ? censorText(podDetail.trackingNumber || "-")
              : podDetail.trackingNumber || "-"}
          </Text>
          <Text varient="body2" color="disabled" style={styles.title}>
            หมายเหตุ
          </Text>
          <Text varient="body2">{podDetail.remark || "-"}</Text>
        </View>
      )}
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
  addressContent: {
    paddingTop: normalize(16),
  },
  title: {
    paddingTop: normalize(8),
  },
});
