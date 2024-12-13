import { fData } from "@/utils/number";
import { router, useLocalSearchParams } from "expo-router";
import Yup from "@/utils/yup";
import { get, isEmpty } from "lodash";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "@/components/NavigationBar";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import Text from "@/components/Text";
import FormProvider from "@/components/HookForm/FormProvider";
import RHFUploadButton from "@/components/HookForm/RHFUploadButton";
import Button from "@/components/Button";
import { normalize } from "@/utils/normalizeSize";
import { imagePath } from "@/utils/file";
import { RegisterUploadsFormValue, EmployeeRegisterParam } from "./types";
import { useGetUserQuery } from "@/graphql/generated/graphql";

export const MAX_FILE_SIZE = 10 * 1000 * 1000;
const MAXIMUM_FILE_SIZE_TEXT = `ขนาดไฟล์ไม่เกิน ${fData(MAX_FILE_SIZE)}`;

export default function ReDocument() {
  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param) as EmployeeRegisterParam;
  const driverId = get(params, "id", "");

  const { data } = useGetUserQuery({ variables: { id: driverId } });
  const user = useMemo(() => data?.getUser, [data]);
  const documents = useMemo(() => user?.driverDetail?.documents, [user]);

  const RegisterUploadSchema = Yup.object().shape({
    frontOfVehicle: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดรูปด้านหน้ารถ", (value) => !isEmpty(value)),
    backOfVehicle: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดรูปด้านหลังรถ", (value) => !isEmpty(value)),
    leftOfVehicle: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test(
        "require-file",
        "อัพโหลดรูปด้านข้างซ้ายรถ",
        (value) => !isEmpty(value)
      ),
    rigthOfVehicle: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test(
        "require-file",
        "อัพโหลดรูปด้านข้างขวารถ",
        (value) => !isEmpty(value)
      ),
    copyVehicleRegistration: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test(
        "require-file",
        "อัพโหลดเอกสารสำเนาทะเบียนรถ",
        (value) => !isEmpty(value)
      ),
    copyIDCard: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test(
        "require-file",
        "อัพโหลดสำเนาบัตรประชาชน",
        (value) => !isEmpty(value)
      ),
    copyDrivingLicense: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดสำเนาใบขับขี่", (value) => !isEmpty(value)),
    copyBookBank: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),
    copyHouseRegistration: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),
    insurancePolicy: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),
    criminalRecordCheckCert: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),
  });

  const defaultValues = useMemo(() => {
    const docs = params?.documents;
    return {
      frontOfVehicle:
        docs?.frontOfVehicle ||
        (documents?.frontOfVehicle
          ? imagePath(documents?.frontOfVehicle?.filename)
          : undefined),
      backOfVehicle:
        docs?.backOfVehicle ||
        (documents?.backOfVehicle
          ? imagePath(documents.backOfVehicle.filename)
          : undefined),
      leftOfVehicle:
        docs?.leftOfVehicle ||
        (documents?.leftOfVehicle
          ? imagePath(documents.leftOfVehicle.filename)
          : undefined),
      rigthOfVehicle:
        docs?.rigthOfVehicle ||
        (documents?.rigthOfVehicle
          ? imagePath(documents.rigthOfVehicle.filename)
          : undefined),
      copyVehicleRegistration:
        docs?.copyVehicleRegistration ||
        (documents?.copyVehicleRegistration
          ? imagePath(documents.copyVehicleRegistration.filename)
          : undefined),
      copyIDCard:
        docs?.copyIDCard ||
        (documents?.copyIDCard
          ? imagePath(documents.copyIDCard.filename)
          : undefined),
      copyDrivingLicense:
        docs?.copyDrivingLicense ||
        (documents?.copyDrivingLicense
          ? imagePath(documents.copyDrivingLicense.filename)
          : undefined),
      copyBookBank:
        docs?.copyBookBank ||
        (documents?.copyBookBank
          ? imagePath(documents.copyBookBank.filename)
          : undefined),
      copyHouseRegistration:
        docs?.copyHouseRegistration ||
        (documents?.copyHouseRegistration
          ? imagePath(documents.copyHouseRegistration.filename)
          : undefined),
      insurancePolicy:
        docs?.insurancePolicy ||
        (documents?.insurancePolicy
          ? imagePath(documents.insurancePolicy.filename)
          : undefined),
      criminalRecordCheckCert:
        docs?.criminalRecordCheckCert ||
        (documents?.criminalRecordCheckCert
          ? imagePath(documents.criminalRecordCheckCert.filename)
          : undefined),
    };
  }, []);

  const methods = useForm<RegisterUploadsFormValue>({
    resolver: yupResolver(RegisterUploadSchema) as any,
    defaultValues,
  });

  const { handleSubmit, watch } = methods;

  async function onSubmit(values: RegisterUploadsFormValue) {
    try {
      if (params && values) {
        const documents = new RegisterUploadsFormValue(values);
        const param = JSON.stringify(Object.assign(params, { documents }));
        router.push({
          pathname: "/employee/re-register/re-preview",
          params: { param },
        });
      }
    } catch (error) {
      console.log("errors: ", error);
    }
  }

  const values = watch();

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar title="เอกสารประกอบการสมัคร" />
      <ScrollView style={styles.wrapper}>
        <FormProvider
          methods={methods}
          containerStyle={styles.sectionContainer}
        >
          <View style={styles.documentList}>
            <View>
              <Text>รูปถ่ายรถยนต์{" (บังคับ)"}</Text>
            </View>
            <View style={styles.rowWrapper}>
              <RHFUploadButton
                file={values.frontOfVehicle}
                name="frontOfVehicle"
                label="ด้านหน้ารถ"
                isImagePreview
                actionMenus={["CAMERA", "GALLERY"]}
              />
              <RHFUploadButton
                file={values.backOfVehicle}
                name="backOfVehicle"
                label="ด้านหลังรถ"
                isImagePreview
                actionMenus={["CAMERA", "GALLERY"]}
              />
            </View>
            <View style={styles.rowWrapper}>
              <RHFUploadButton
                file={values.leftOfVehicle}
                name="leftOfVehicle"
                label="ด้านข้าง ซ้ายรถ"
                isImagePreview
                actionMenus={["CAMERA", "GALLERY"]}
              />
              <RHFUploadButton
                file={values.rigthOfVehicle}
                name="rigthOfVehicle"
                label="ด้านข้าง ขวารถ"
                isImagePreview
                actionMenus={["CAMERA", "GALLERY"]}
              />
            </View>
            <RHFUploadButton
              file={values.copyVehicleRegistration}
              name="copyVehicleRegistration"
              label={`สำเนาทะเบียนรถ (บังคับ)`}
            />
            <RHFUploadButton
              file={values.copyIDCard}
              name="copyIDCard"
              label={`สำเนาบัตรประชาชน (บังคับ)`}
            />
            <RHFUploadButton
              file={values.copyDrivingLicense}
              name="copyDrivingLicense"
              label={`สำเนาใบขับขี่ (บังคับ)`}
            />
            {/* <RHFUploadButton
              file={values.copyBookBank}
              name="copyBookBank"
              label="สำเนาหน้าบัญชีธนาคาร (บังคับ)"
            /> */}
            <RHFUploadButton
              file={values.copyHouseRegistration}
              name="copyHouseRegistration"
              label="สำเนาทะเบียนบ้าน"
            />
            <RHFUploadButton
              file={values.insurancePolicy}
              name="insurancePolicy"
              label="กรมธรรม์ประกันรถ"
            />
            <RHFUploadButton
              file={values.criminalRecordCheckCert}
              name="criminalRecordCheckCert"
              label="หนังสือรับรองตรวจประวัติอาชญากรรม"
            />
            <View style={styles.submitStyle}>
              <Button
                fullWidth
                size="large"
                title="ดำเนินการต่อ"
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </FormProvider>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: normalize(16),
  },
  sectionContainer: {
    paddingBottom: normalize(32),
    paddingHorizontal: normalize(16),
  },
  documentList: {
    gap: normalize(12),
    paddingTop: normalize(24),
  },
  submitStyle: {
    paddingTop: normalize(32),
  },
  rowWrapper: {
    flexDirection: "row",
    gap: 8,
  },
});
