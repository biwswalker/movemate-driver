import Button from "@/components/Button";
import FormProvider from "@/components/HookForm/FormProvider";
import RHFUploadButton from "@/components/HookForm/RHFUploadButton";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import useAuth from "@/hooks/useAuth";
import { imagePath } from "@/utils/file";
import { normalize } from "@/utils/normalizeSize";
import { fData } from "@/utils/number";
import Yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { forEach, get, includes, isEmpty, omit, pick } from "lodash";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { Modal, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FileInput as FileInputGraph,
  EDriverType,
  EUserStatus,
  EUserValidationStatus,
  useCheckUserPendingStatusQuery,
  useUpdateProfileMutation,
  EUserType,
  DriverDocumentInput,
} from "@/graphql/generated/graphql";
import { fileUploadAPI } from "@/services/upload";
import { DriverFormValue } from "@/types/re-register";
import { YUP_VALIDATION_ERROR_TYPE } from "@/constants/error";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { useFocusEffect } from "expo-router";
import { DropdownAlertType } from "react-native-dropdownalert";
import Iconify from "@/components/Iconify";
import hexToRgba from "hex-to-rgba";

interface FormValue {
  frontOfVehicle: FileInput | string;
  backOfVehicle: FileInput | string;
  leftOfVehicle: FileInput | string;
  rigthOfVehicle: FileInput | string;
  copyVehicleRegistration: FileInput | string;
  copyIDCard: FileInput | string;
  copyDrivingLicense: FileInput | string;
  copyBookBank: FileInput | string;
  copyHouseRegistration: FileInput | string;
  insurancePolicy: FileInput | string;
  criminalRecordCheckCert: FileInput | string;
  businessRegistrationCertificate: FileInput | string;
  certificateValueAddedTaxRegistration: FileInput | string;
}

export const MAX_FILE_SIZE = 10 * 1000 * 1000;
const MAXIMUM_FILE_SIZE_TEXT = `ขนาดไฟล์ไม่เกิน ${fData(MAX_FILE_SIZE)}`;

export default function ProfileDocument() {
  const { user, refetchMe } = useAuth();
  const { showSnackbar } = useSnackbarV2();

  const [open, setOpen] = useState(false);

  const { data: checkPendingStatusRaw, refetch: refetchGetStatus } =
    useCheckUserPendingStatusQuery({ variables: { id: user?._id || "" } });

  const [updateProfile, { loading: updateLoading }] =
    useUpdateProfileMutation();

  const isApproved =
    user?.status === EUserStatus.ACTIVE &&
    user.validationStatus === EUserValidationStatus.APPROVE;

  const driverInfo = useMemo(() => user?.driverDetail, [user]);
  const documents = useMemo(() => user?.driverDetail?.documents, [user]);
  const isBusinessRegistration = useMemo(() => {
    if (user?.driverDetail) {
      return includes(user.driverDetail.driverType, EDriverType.BUSINESS);
    }
    return false;
  }, [user]);

  const isAgent = user?.userType === EUserType.BUSINESS;
  const isOnlyBusinessDriver = useMemo(() => {
    const driverTypes = get(user, "driverDetail.driverType", []);
    if (user?.driverDetail) {
      if (driverTypes.length <= 1) {
        return includes(driverTypes, EDriverType.BUSINESS_DRIVER);
      }
    }
    return false;
  }, [user]);

  const isPendingReview = useMemo(
    () => checkPendingStatusRaw?.checkUserPendingStatus || false,
    [checkPendingStatusRaw]
  );

  useFocusEffect(() => {
    refetchMe();
    refetchGetStatus();
  });

  const RegisterUploadSchema = Yup.object().shape({
    frontOfVehicle: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดรูปด้านหน้ารถ", (value) =>
        isBusinessRegistration ? true : !isEmpty(value)
      ),
    backOfVehicle: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดรูปด้านหลังรถ", (value) =>
        isBusinessRegistration ? true : !isEmpty(value)
      ),
    leftOfVehicle: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดรูปด้านข้างซ้ายรถ", (value) =>
        isBusinessRegistration ? true : !isEmpty(value)
      ),
    rigthOfVehicle: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดรูปด้านข้างขวารถ", (value) =>
        isBusinessRegistration ? true : !isEmpty(value)
      ),
    copyVehicleRegistration: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดเอกสารสำเนาทะเบียนรถ", (value) =>
        isBusinessRegistration ? true : !isEmpty(value)
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
      .test("require-file", "อัพโหลดสำเนาใบขับขี่", (value) =>
        isBusinessRegistration ? true : !isEmpty(value)
      ),
    copyBookBank: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดสำเนาหน้าบัญชีธนาคาร", (value) =>
        isOnlyBusinessDriver ? true : !isEmpty(value)
      ),
    copyHouseRegistration: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),
    insurancePolicy: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),
    criminalRecordCheckCert: Yup.mixed().maxFileSize(MAXIMUM_FILE_SIZE_TEXT),

    businessRegistrationCertificate: Yup.mixed()
      .maxFileSize(MAXIMUM_FILE_SIZE_TEXT)
      .test("require-file", "อัพโหลดหนังสือรับรองบริษัท", (value) =>
        isBusinessRegistration ? !isEmpty(value) : true
      ),
    certificateValueAddedTaxRegistration: Yup.mixed().maxFileSize(
      MAXIMUM_FILE_SIZE_TEXT
    ),
  });

  const defaultValues = useMemo(
    () => ({
      frontOfVehicle: documents?.frontOfVehicle
        ? imagePath(documents.frontOfVehicle.filename)
        : undefined,
      backOfVehicle: documents?.backOfVehicle
        ? imagePath(documents.backOfVehicle.filename)
        : undefined,
      leftOfVehicle: documents?.leftOfVehicle
        ? imagePath(documents.leftOfVehicle.filename)
        : undefined,
      rigthOfVehicle: documents?.rigthOfVehicle
        ? imagePath(documents.rigthOfVehicle.filename)
        : undefined,
      copyVehicleRegistration: documents?.copyVehicleRegistration
        ? imagePath(documents.copyVehicleRegistration.filename)
        : undefined,
      copyIDCard: documents?.copyIDCard
        ? imagePath(documents.copyIDCard.filename)
        : undefined,
      copyDrivingLicense: documents?.copyDrivingLicense
        ? imagePath(documents.copyDrivingLicense.filename)
        : undefined,
      copyBookBank: documents?.copyBookBank
        ? imagePath(documents.copyBookBank.filename)
        : undefined,
      copyHouseRegistration: documents?.copyHouseRegistration
        ? imagePath(documents.copyHouseRegistration.filename)
        : undefined,
      insurancePolicy: documents?.insurancePolicy
        ? imagePath(documents.insurancePolicy.filename)
        : undefined,
      criminalRecordCheckCert: documents?.criminalRecordCheckCert
        ? imagePath(documents.criminalRecordCheckCert.filename)
        : undefined,
      businessRegistrationCertificate:
        documents?.businessRegistrationCertificate
          ? imagePath(documents.businessRegistrationCertificate.filename)
          : undefined,
      certificateValueAddedTaxRegistration:
        documents?.certificateValueAddedTaxRegistration
          ? imagePath(documents.certificateValueAddedTaxRegistration.filename)
          : undefined,
    }),
    [documents]
  );

  const methods = useForm<FormValue>({
    resolver: yupResolver(RegisterUploadSchema) as any,
    defaultValues,
    disabled: !isApproved,
  });

  const { handleSubmit, reset, watch, setError, setFocus } = methods;
  const values = watch();

  useEffect(() => {
    if (documents) {
      reset(defaultValues);
      console.log("defaultValues: ", defaultValues);
    }
  }, [documents]);

  async function reformUpload(
    file: FileInput | string
  ): Promise<FileInputGraph | undefined> {
    try {
      if (typeof file === "string") {
        return undefined;
      } else if (file) {
        console.log("uri: ", file);
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
    } catch (error: any) {
      console.error("Network error occurred during file upload:", error);
      if (error.response) {
        // Server returned a response with error details
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        // No response received (network error)
        console.error(
          "Request was made but no response received:",
          JSON.stringify(error.request)
        );
      } else {
        // Some error occurred during request setup
        console.error("Error setting up the request:", error.message);
      }
      return undefined;
    }
  }

  function handleErrorVerified(error: ApolloError) {
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
                type: DropdownAlertType.Warn,
              });
            }
            forEach(errors, ({ path, ...message }) => setError(path, message));
            setFocus(get(errors, "0.path", ""));
            break;
          default:
            showSnackbar({
              title: "พบข้อผิดพลาด",
              message: graphQLError?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
              type: DropdownAlertType.Warn,
            });
            break;
        }
      });
    } else {
      console.log("error: ", error);
      showSnackbar({
        title: "พบข้อผิดพลาด",
        message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
        type: DropdownAlertType.Warn,
      });
    }
  }

  function handleVerifySuccess() {
    setOpen(true);
    refetchMe();
    refetchGetStatus();
  }

  async function onSubmit(values: FormValue) {
    try {
      const frontOfVehicle = (await reformUpload(
        values.frontOfVehicle
      )) as FileInputGraph;
      const backOfVehicle = (await reformUpload(
        values.backOfVehicle
      )) as FileInputGraph;
      const leftOfVehicle = (await reformUpload(
        values.leftOfVehicle
      )) as FileInputGraph;
      const rigthOfVehicle = (await reformUpload(
        values.rigthOfVehicle
      )) as FileInputGraph;
      const copyVehicleRegistration = (await reformUpload(
        values.copyVehicleRegistration
      )) as FileInputGraph;
      const copyIDCard = (await reformUpload(
        values.copyIDCard
      )) as FileInputGraph;
      const copyDrivingLicense = (await reformUpload(
        values.copyDrivingLicense
      )) as FileInputGraph;
      const copyBookBank = await reformUpload(values.copyBookBank);
      const copyHouseRegistration = await reformUpload(
        values.copyHouseRegistration
      );
      const insurancePolicy = await reformUpload(values.insurancePolicy);
      const criminalRecordCheckCert = await reformUpload(
        values.criminalRecordCheckCert
      );
      const businessRegistrationCertificate = await reformUpload(
        values.businessRegistrationCertificate
      );
      const certificateValueAddedTaxRegistration = await reformUpload(
        values.certificateValueAddedTaxRegistration
      );

      const detailData = new DriverFormValue({
        policyVersion: user?.acceptPolicyVersion || -1,
        driverType: isAgent
          ? EDriverType.BUSINESS
          : isOnlyBusinessDriver
            ? EDriverType.BUSINESS_DRIVER
            : EDriverType.INDIVIDUAL_DRIVER,
        title: driverInfo?.title || "",
        otherTitle: driverInfo?.otherTitle || "",
        firstname: driverInfo?.firstname || "",
        lastname: driverInfo?.lastname || "",
        businessName: driverInfo?.businessName || "",
        businessBranch: driverInfo?.businessBranch || "",
        taxNumber: driverInfo?.taxNumber || "",
        phoneNumber: driverInfo?.phoneNumber || "",
        lineId: driverInfo?.lineId || "",
        password: "",
        address: driverInfo?.address || "",
        province: driverInfo?.province || "",
        district: driverInfo?.district || "",
        subDistrict: driverInfo?.subDistrict || "",
        postcode: driverInfo?.postcode || "",
        bank: driverInfo?.bank || "",
        bankBranch: driverInfo?.bankBranch || "",
        bankName: driverInfo?.bankName || "",
        bankNumber: driverInfo?.bankNumber || "",
        serviceVehicleTypes:
          driverInfo?.serviceVehicleTypes?.map((type) => type._id) || [],
      });

      const documentData: DriverDocumentInput = {
        ...(frontOfVehicle ? { frontOfVehicle } : {}),
        ...(backOfVehicle ? { backOfVehicle } : {}),
        ...(leftOfVehicle ? { leftOfVehicle } : {}),
        ...(rigthOfVehicle ? { rigthOfVehicle } : {}),
        ...(copyVehicleRegistration ? { copyVehicleRegistration } : {}),
        ...(copyIDCard ? { copyIDCard } : {}),
        ...(copyDrivingLicense ? { copyDrivingLicense } : {}),
        ...(copyBookBank ? { copyBookBank } : {}),
        ...(copyHouseRegistration ? { copyHouseRegistration } : {}),
        ...(insurancePolicy ? { insurancePolicy } : {}),
        ...(criminalRecordCheckCert ? { criminalRecordCheckCert } : {}),
        ...(businessRegistrationCertificate
          ? { businessRegistrationCertificate }
          : {}),
        ...(certificateValueAddedTaxRegistration
          ? { certificateValueAddedTaxRegistration }
          : {}),
      };

      updateProfile({
        variables: {
          id: user?._id || "",
          data: {
            detail: omit(detailData, [
              "policyVersion",
              "driverType",
              "password",
            ]),
            documents: documentData,
          },
        },
        onCompleted: handleVerifySuccess,
        onError: handleErrorVerified,
      });
    } catch (error) {
      console.log("errors: ", error);
    }
  }

  return (
    <Fragment>
      <View style={styles.container}>
        <SafeAreaView style={styles.wrapper}>
          <NavigationBar title="ข้อมูลเอกสาร" />
          <View style={styles.content}>
            {isPendingReview && <PendingReview />}
            <FormProvider
              methods={methods}
              containerStyle={styles.sectionContainer}
            >
              <View style={styles.documentList}>
                {isBusinessRegistration && (
                  <Fragment>
                    <RHFUploadButton
                      disabled={
                        (isApproved &&
                          !!values.businessRegistrationCertificate) ||
                        isPendingReview
                      }
                      file={values.businessRegistrationCertificate}
                      name="businessRegistrationCertificate"
                      label="หนังสือรับรองบริษัท (บังคับ)"
                    />
                    <RHFUploadButton
                      disabled={
                        (isApproved && !!values.copyIDCard) || isPendingReview
                      }
                      file={values.copyIDCard}
                      name="copyIDCard"
                      label="สำเนาบัตรประชาชน (บังคับ)"
                    />
                    <RHFUploadButton
                      disabled={
                        (isApproved &&
                          !!values.certificateValueAddedTaxRegistration) ||
                        isPendingReview
                      }
                      file={values.certificateValueAddedTaxRegistration}
                      name="certificateValueAddedTaxRegistration"
                      label="ภพ 20"
                    />
                    <RHFUploadButton
                      disabled={
                        (isApproved && !!values.copyBookBank) || isPendingReview
                      }
                      file={values.copyBookBank}
                      name="copyBookBank"
                      label="สำเนาหน้าบัญชีธนาคาร (บังคับ)"
                    />
                  </Fragment>
                )}

                {!isBusinessRegistration && (
                  <Fragment>
                    <View>
                      <Text>
                        รูปถ่ายรถยนต์{isBusinessRegistration ? "" : " (บังคับ)"}
                      </Text>
                    </View>
                    <View style={styles.rowWrapper}>
                      <RHFUploadButton
                        disabled={
                          (isApproved && !!values.frontOfVehicle) ||
                          isPendingReview
                        }
                        file={values.frontOfVehicle}
                        name="frontOfVehicle"
                        label="ด้านหน้ารถ"
                        isImagePreview
                        actionMenus={["CAMERA", "GALLERY"]}
                      />
                      <RHFUploadButton
                        disabled={
                          (isApproved && !!values.backOfVehicle) ||
                          isPendingReview
                        }
                        file={values.backOfVehicle}
                        name="backOfVehicle"
                        label="ด้านหลังรถ"
                        isImagePreview
                        actionMenus={["CAMERA", "GALLERY"]}
                      />
                    </View>
                    <View style={styles.rowWrapper}>
                      <RHFUploadButton
                        disabled={
                          (isApproved && !!values.leftOfVehicle) ||
                          isPendingReview
                        }
                        file={values.leftOfVehicle}
                        name="leftOfVehicle"
                        label="ด้านข้าง ซ้ายรถ"
                        isImagePreview
                        actionMenus={["CAMERA", "GALLERY"]}
                      />
                      <RHFUploadButton
                        disabled={
                          (isApproved && !!values.rigthOfVehicle) ||
                          isPendingReview
                        }
                        file={values.rigthOfVehicle}
                        name="rigthOfVehicle"
                        label="ด้านข้าง ขวารถ"
                        isImagePreview
                        actionMenus={["CAMERA", "GALLERY"]}
                      />
                    </View>
                    <RHFUploadButton
                      disabled={
                        (isApproved && !!values.copyVehicleRegistration) ||
                        isPendingReview
                      }
                      file={values.copyVehicleRegistration}
                      name="copyVehicleRegistration"
                      label={`สำเนาทะเบียนรถ${isBusinessRegistration ? "" : " (บังคับ)"}`}
                    />
                    <RHFUploadButton
                      disabled={
                        (isApproved && !!values.copyIDCard) || isPendingReview
                      }
                      file={values.copyIDCard}
                      name="copyIDCard"
                      label={`สำเนาบัตรประชาชน${isBusinessRegistration ? "" : " (บังคับ)"}`}
                    />
                    <RHFUploadButton
                      disabled={
                        (isApproved && !!values.copyDrivingLicense) ||
                        isPendingReview
                      }
                      file={values.copyDrivingLicense}
                      name="copyDrivingLicense"
                      label={`สำเนาใบขับขี่${isBusinessRegistration ? "" : " (บังคับ)"}`}
                    />
                    {!isOnlyBusinessDriver && (
                      <RHFUploadButton
                        disabled={
                          (isApproved && !!values.copyBookBank) ||
                          isPendingReview
                        }
                        file={values.copyBookBank}
                        name="copyBookBank"
                        label="สำเนาหน้าบัญชีธนาคาร (บังคับ)"
                      />
                    )}
                  </Fragment>
                )}
                <RHFUploadButton
                  disabled={
                    (isApproved && !!values.copyHouseRegistration) ||
                    isPendingReview
                  }
                  file={values.copyHouseRegistration}
                  name="copyHouseRegistration"
                  label="สำเนาทะเบียนบ้าน"
                />
                <RHFUploadButton
                  disabled={
                    (isApproved && !!values.insurancePolicy) || isPendingReview
                  }
                  file={values.insurancePolicy}
                  name="insurancePolicy"
                  label="กรมธรรม์ประกันรถ"
                />
                <RHFUploadButton
                  disabled={
                    (isApproved && !!values.criminalRecordCheckCert) ||
                    isPendingReview
                  }
                  file={values.criminalRecordCheckCert}
                  name="criminalRecordCheckCert"
                  label="หนังสือรับรองตรวจประวัติอาชญากรรม"
                />
                <View style={styles.submitStyle}>
                  <Button
                    fullWidth
                    size="large"
                    title="บันทึกข้อมูล"
                    disabled={!isApproved || isPendingReview}
                    onPress={handleSubmit(onSubmit)}
                    loading={updateLoading}
                  />
                </View>
              </View>
            </FormProvider>
          </View>
        </SafeAreaView>
      </View>
      <ConfirmDialog open={open} setOpen={setOpen} />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  rowWrapper: {
    flexDirection: "row",
    gap: normalize(8),
  },
  sectionContainer: {
    paddingBottom: normalize(32),
    paddingHorizontal: normalize(16),
  },
  documentList: {
    gap: normalize(12),
    paddingBottom: normalize(16),
  },
  sectionTitleWrapper: {
    // paddingTop: normalize(48),
  },
  submitStyle: {
    paddingTop: normalize(32),
  },
});

function PendingReview() {
  return (
    <View style={pendingStyle.infoTextContainer}>
      <View style={pendingStyle.infoTextWrapper}>
        <Iconify
          icon="iconoir:warning-circle-solid"
          size={normalize(18)}
          color={colors.warning.dark}
          style={pendingStyle.iconWrapper}
        />
        <Text varient="body2" style={pendingStyle.infoText}>
          โปรไฟล์ของคุณกำลังอยู่ระหว่างการตรวจสอบ
          ไม่สามารถแก้ไขข้อมูลได้ในขณะนี้
        </Text>
      </View>
    </View>
  );
}

const pendingStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  inputWrapper: {
    paddingHorizontal: normalize(16),
  },
  actionWrapper: {
    paddingVertical: normalize(32),
  },
  formSubtitle: {
    paddingTop: normalize(32),
    paddingLeft: normalize(8),
  },
  helperText: {
    marginTop: normalize(8),
    paddingLeft: normalize(12),
  },
  inputWrapperColumn: {
    flexDirection: "row",
    gap: 8,
  },
  infoTextContainer: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(16),
  },
  infoTextWrapper: {
    backgroundColor: hexToRgba(colors.warning.main, 0.08),
    padding: normalize(16),
    borderRadius: normalize(8),
    gap: normalize(8),
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    minWidth: normalize(24),
    alignSelf: "flex-start",
  },
  infoText: {
    color: colors.warning.dark,
    flex: 1,
  },
});

interface IConfirmDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function ConfirmDialog({ open, setOpen }: IConfirmDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };

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
            <Text varient="h4">เพื่อทราบ</Text>
          </View>
          <View style={modalStyle.detailWrapper}>
            <Text>บันทึกข้อมูลสำเร็จ</Text>
            <Text>ข้อมูลจะยังไม่เปลี่ยนแปลงจนกว่า</Text>
            <Text>ผู้ดูแลระบบยืนยันข้อมูลแล้ว</Text>
          </View>
          <View style={modalStyle.actionWrapper}>
            <Button
              varient="soft"
              size="large"
              fullWidth
              color="inherit"
              title="รับทราบ"
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
    padding: normalize(24),
  },
  wrapper: {
    backgroundColor: colors.common.white,
    overflow: "hidden",
    borderRadius: normalize(16),
    width: "100%",
    padding: normalize(24),
  },
  actionWrapper: {
    gap: 8,
    flexDirection: "row",
  },
  titleWrapper: {
    marginBottom: normalize(16),
  },
  detailWrapper: {
    marginBottom: normalize(24),
  },
});
