import Button from "@/components/Button";
import FormProvider from "@/components/HookForm/FormProvider";
import RHFSelectDropdown from "@/components/HookForm/RHFSelectDropdown";
import RHFTextInput from "@/components/HookForm/RHFTextInput";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import { YUP_VALIDATION_ERROR_TYPE } from "@/constants/error";
import {
  BANKPROVIDER,
  BUSINESS_TITLE_NAME_OPTIONS,
  TITLE_NAME_OPTIONS,
} from "@/constants/values";
import {
  DriverDetail,
  EDriverType,
  EUserStatus,
  EUserType,
  EUserValidationStatus,
  useCheckUserPendingStatusQuery,
  useGetDistrictLazyQuery,
  useGetProvinceQuery,
  useGetSubDistrictLazyQuery,
  useGetVehicleTypeAvailableQuery,
  useUpdateProfileMutation,
  VehicleType,
} from "@/graphql/generated/graphql";
import useAuth from "@/hooks/useAuth";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { normalize } from "@/utils/normalizeSize";
import Yup from "@/utils/yup";
import { ApolloError } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect } from "expo-router";
import {
  find,
  forEach,
  get,
  includes,
  isEqual,
  map,
  omit,
  reduce,
} from "lodash";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { Modal, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DriverFormValueType } from "@/types/register";
import CustomTextInput from "@components/TextInput";
import { TextInput } from "react-native-paper";
import Iconify from "@/components/Iconify";
import VehicleSelectorModal, {
  VehicleSelectorRef,
} from "@/components/Modals/vehicle-selector";
import { DriverFormValue } from "@/types/re-register";
import hexToRgba from "hex-to-rgba";
import { DropdownAlertType } from "react-native-dropdownalert";

type FormValues = Omit<
  DriverFormValueType,
  "password" | "confirmPassword" | "policyVersion" | "driverType"
>;

export default function ProfileDetail() {
  const bottomSheetModalRef = useRef<VehicleSelectorRef>(null);
  const { user, refetchMe } = useAuth();
  const { showSnackbar } = useSnackbarV2();

  const { data: checkPendingStatusRaw, refetch: refetchGetStatus } =
    useCheckUserPendingStatusQuery({ variables: { id: user?._id || "" } });

  const [updateProfile, { loading: updateLoading }] =
    useUpdateProfileMutation();

  const [open, setOpen] = useState(false);

  const isAgent = user?.userType === EUserType.BUSINESS;
  const driverTypes = useMemo(
    () => get(user, "driverDetail.driverType", []),
    [user]
  );
  const isOnlyBusinessDriver = useMemo(() => {
    if (driverTypes.length > 1) {
      return false;
    } else if (includes(driverTypes, EDriverType.BUSINESS_DRIVER)) {
      return true;
    }
    return false;
  }, [user?.driverDetail, driverTypes]);

  const isPendingReview = useMemo(
    () => checkPendingStatusRaw?.checkUserPendingStatus || false,
    [checkPendingStatusRaw]
  );

  useEffect(() => {
    refetchMe();
    refetchGetStatus();
  }, []);

  const { data: vehicleData } = useGetVehicleTypeAvailableQuery();
  const { data: prvinces, loading: provinceLoading } = useGetProvinceQuery();
  const [getDistrict, { data: district, loading: districtLoading }] =
    useGetDistrictLazyQuery();
  const [getSubDistrict, { data: subDistrict, loading: subDistrictLoading }] =
    useGetSubDistrictLazyQuery();

  const isApproved =
    user?.status === EUserStatus.ACTIVE &&
    user.validationStatus === EUserValidationStatus.APPROVE;

  const vehicleTypes = useMemo<VehicleType[]>(() => {
    if (vehicleData?.getVehicleTypeAvailable) {
      return map(vehicleData.getVehicleTypeAvailable, (vehi) => ({
        ...vehi,
        name: `${vehi.name}${vehi.isConfigured ? "" : " (ยังไม่ให้บริการ)"}`,
      })) as VehicleType[];
    }
    return [];
  }, [vehicleData]);

  const driverDetail = useMemo<DriverDetail | undefined>(() => {
    return user?.driverDetail as DriverDetail;
  }, [user]);

  useEffect(() => {
    if (user?.driverDetail) {
      const driver = user.driverDetail;
      if (driver.province) {
        getDistrict({ variables: { provinceThName: driver.province } });
      }
      if (driver.district) {
        getSubDistrict({ variables: { districtName: driver.district } });
      }
    }
  }, [user?.driverDetail]);

  const IndividualScema = Yup.object().shape({
    policyVersion: Yup.number(),
    driverType: Yup.string(),
    title: Yup.string().required("กรุณาเลือกคำนำหน้าชื่อ"),
    otherTitle: Yup.string().when("title", ([title], schema) =>
      isEqual(title, "อื่นๆ")
        ? schema.required("ระบุคำนำหน้าชื่อ")
        : schema.notRequired()
    ),
    ...(isAgent
      ? {
          businessName: Yup.string().required("ระบุชื่อบริษัท"),
          businessBranch: Yup.string(),
        }
      : {
          firstname: Yup.string().required("ระบุชื่อ"),
          lastname: Yup.string().required("ระบุนามสกุล"),
        }),
    taxNumber: Yup.string()
      .matches(/^[0-9]+$/, "เลขประจำตัวผู้เสียภาษีเป็นตัวเลขเท่านั้น")
      .min(13, "เลขประจำตัวผู้เสียภาษี 13 หลัก")
      .max(13, "เลขประจำตัวผู้เสียภาษี 13 หลัก"),
    phoneNumber: Yup.string()
      .matches(/^(0[689]{1})+([0-9]{8})+$/, "เบอร์ติดต่อไม่ถูกต้อง")
      .min(10, "ระบุหมายเลขโทรศัพท์ไม่เกิน 10 หลัก")
      .max(10, "ระบุหมายเลขโทรศัพท์ไม่เกิน 10 หลัก")
      .required("ระบุหมายเลขโทรศัพท์"),
    lineId: Yup.string(), //.required('ระบุไลน์ไอดี'),
    address: Yup.string().required("ระบุที่อยู่"),
    province: Yup.string().required("ระบุจังหวัด"),
    district: Yup.string().required("ระบุอำเภอ/แขวง"),
    subDistrict: Yup.string().required("ระบุตำบล/เขต"),
    postcode: Yup.string()
      .required("ระบุรหัสไปรษณีย์")
      .min(5, "รหัสไปรษณีย์ 5 หลัก")
      .max(5, "รหัสไปรษณีย์ 5 หลัก"),
    ...(isOnlyBusinessDriver
      ? {}
      : {
          bank: Yup.string().required("ระบุธนาคารที่ชำระ"),
          bankBranch: Yup.string()
            .required("ระบุชื่อสาขาธนาคาร")
            .matches(/^[a-zA-Z0-9ก-๙\s]+$/g, "ไม่อนุญาตมีอักษรพิเศษ"),
          bankName: Yup.string()
            .required("ระบุชื่อบัญชี")
            .matches(/^[a-zA-Z0-9ก-๙\s]+$/g, "ไม่อนุญาตมีอักษรพิเศษ"),
          bankNumber: Yup.string()
            .required("ระบุเลขที่บัญชี")
            .matches(/^[0-9\s]+$/g, "ตัวเลขเท่านั้น")
            .min(10, "ตัวเลขขั้นต่ำ 10 หลัก")
            .max(15, "ตัวเลขสูงสุด 15 หลัก"),
        }),
    serviceVehicleTypes: Yup.array().min(1, "ระบุประเภทรถที่ให้บริการ"),
    licensePlateProvince: Yup.string().required("ระบุจังหวัดทะเบียนรถ"),
    licensePlateNumber: Yup.string().required("ระบุหมายเลขทะเบียนรถ"),
  });

  const defaultValues: FormValues = {
    title: driverDetail?.title || "",
    otherTitle: driverDetail?.otherTitle || "",
    firstname: driverDetail?.firstname || "",
    lastname: driverDetail?.lastname || "",
    businessName: driverDetail?.businessName || "",
    businessBranch: driverDetail?.businessBranch || "",
    taxNumber: driverDetail?.taxNumber || "",
    phoneNumber: driverDetail?.phoneNumber || "",
    lineId: driverDetail?.lineId || "",
    // Address
    address: driverDetail?.address || "",
    province: driverDetail?.province || "",
    district: driverDetail?.district || "",
    subDistrict: driverDetail?.subDistrict || "",
    postcode: driverDetail?.postcode || "",
    // Bank
    bank: driverDetail?.bank || "",
    bankBranch: driverDetail?.bankBranch || "",
    bankName: driverDetail?.bankName || "",
    bankNumber: driverDetail?.bankNumber || "",
    // Vehicle type
    serviceVehicleTypes: map(
      driverDetail?.serviceVehicleTypes,
      (service) => service._id
    ),
    licensePlateProvince: driverDetail?.licensePlateProvince || "",
    licensePlateNumber: driverDetail?.licensePlateNumber || "",
  };

  const methods = useForm<FormValues>({
    resolver: yupResolver(IndividualScema) as any,
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    setError,
    setFocus,
    formState: { errors },
  } = methods;

  const values = watch();

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

  async function onSubmit(values: FormValues) {
    try {
      const submitData = new DriverFormValue({
        ...values,
        password: "",
        driverType: isAgent
          ? EDriverType.BUSINESS
          : isOnlyBusinessDriver
            ? EDriverType.BUSINESS_DRIVER
            : EDriverType.INDIVIDUAL_DRIVER,
        policyVersion: -1,
      });
      updateProfile({
        variables: {
          id: user?._id || "",
          data: {
            detail: omit(submitData, [
              "policyVersion",
              "driverType",
              "password",
            ]),
            documents: {},
          },
        },
        onCompleted: handleVerifySuccess,
        onError: handleErrorVerified,
      });
    } catch (error) {
      console.log("error: ", error);
      const errorMessage = get(error, "message", "เกิดข้อผิดพลาด กรุณาลองใหม่");
      showSnackbar({
        title: "พบข้อผิดพลาด",
        message: errorMessage || "เกิดข้อผิดพลาด กรุณาลองใหม่",
        type: DropdownAlertType.Warn,
      });
    }
  }

  function handleSelectedVehicle() {
    if (bottomSheetModalRef.current && isApproved && !isPendingReview) {
      bottomSheetModalRef.current.present();
    }
  }

  function handleOnSelectedVehicleModal(vehicles: string[]) {
    setValue("serviceVehicleTypes", vehicles);
  }
  return (
    <Fragment>
      <View style={styles.container}>
        <SafeAreaView style={styles.wrapper}>
          <NavigationBar title="ข้อมูลส่วนตัว" />
          <View style={styles.content}>
            {isPendingReview && <PendingReview />}
            <FormProvider
              methods={methods}
              containerStyle={styles.inputWrapper}
            >
              <RHFSelectDropdown
                disabled={!isApproved || isPendingReview}
                name="title"
                label="คำนำหน้าชื่อ*"
                options={
                  isAgent ? BUSINESS_TITLE_NAME_OPTIONS : TITLE_NAME_OPTIONS
                }
                value={values.title}
                labelField="label"
                valueField="value"
              />
              {values.title === "อื่นๆ" && (
                <RHFTextInput
                  disabled={!isApproved || isPendingReview}
                  name="otherTitle"
                  label="ระบุคำนำหน้าชื่อ*"
                />
              )}
              {isAgent ? (
                <Fragment>
                  <RHFTextInput
                    disabled={!isApproved || isPendingReview}
                    name="businessName"
                    label="ชื่อบริษัท*"
                  />
                  <RHFTextInput
                    disabled={!isApproved || isPendingReview}
                    name="businessBranch"
                    label="สาขา"
                  />
                </Fragment>
              ) : (
                <Fragment>
                  <RHFTextInput
                    disabled={!isApproved || isPendingReview}
                    name="firstname"
                    label="ชื่อ*"
                  />
                  <RHFTextInput
                    disabled={!isApproved || isPendingReview}
                    name="lastname"
                    label="นามสกุล*"
                  />
                </Fragment>
              )}
              <RHFTextInput
                disabled={!isApproved || isPendingReview}
                name="taxNumber"
                label="เลขบัตรประจำตัวประชาชน*"
                helperText="กรอกเป็นตัวเลข 13 ตัวเท่านั้น"
              />
              <View style={styles.formSubtitle}>
                <Text varient="caption" color="disabled">
                  ข้อมูลการลงชื่อเข้าใช้
                </Text>
              </View>
              <RHFTextInput
                disabled={!isApproved || isPendingReview}
                name="phoneNumber"
                label="เบอร์โทรศัพท์*"
                helperText={
                  errors.phoneNumber
                    ? errors.phoneNumber.message
                    : "กรอกเป็นตัวเลขไม่เกิน 10 ตัวเท่านั้น"
                }
              />
              <RHFTextInput
                disabled={!isApproved || isPendingReview}
                name="lineId"
                label="ไลน์ไอดี"
              />

              <View style={styles.formSubtitle}>
                <Text varient="caption" color="disabled">
                  ข้อมูลที่อยู่ปัจจุบัน
                </Text>
              </View>
              <RHFTextInput
                disabled={!isApproved || isPendingReview}
                name="address"
                label="ที่อยู่*"
              />
              <RHFSelectDropdown
                disabled={!isApproved || isPendingReview}
                name="province"
                label="จังหวัด*"
                options={prvinces?.getProvince || []}
                labelField="nameTh"
                valueField="nameTh"
                value={values.province}
                onChanged={(province) => {
                  getDistrict({
                    variables: { provinceThName: province.nameTh },
                  });
                  setValue("province", province.nameTh);
                  setValue("district", "");
                  setValue("subDistrict", "");
                  setValue("postcode", "");
                }}
              />
              <RHFSelectDropdown
                name="district"
                label="อำเภอ*"
                options={district?.getDistrict || []}
                labelField="nameTh"
                valueField="nameTh"
                value={values.district}
                disabled={!values.province || !isApproved || isPendingReview}
                onChanged={(district) => {
                  getSubDistrict({
                    variables: { districtName: district.nameTh },
                  });
                  setValue("district", district.nameTh);
                  setValue("subDistrict", "");
                  setValue("postcode", "");
                }}
              />
              <RHFSelectDropdown
                name="subDistrict"
                label="ตำบล*"
                options={subDistrict?.getSubDistrict || []}
                disabled={!values.district || !isApproved || isPendingReview}
                value={values.subDistrict}
                labelField="nameTh"
                valueField="nameTh"
                onChanged={(subdistrict) => {
                  const subDistrictData = find(
                    subDistrict?.getSubDistrict || [],
                    ["nameTh", subdistrict.nameTh]
                  );
                  setValue("subDistrict", subdistrict.nameTh);
                  setValue("postcode", `${subDistrictData?.zipCode}` || "");
                }}
              />
              <RHFTextInput
                disabled={!isApproved || isPendingReview}
                name="postcode"
                label="รหัสไปรษณีย์*"
                readOnly
              />
              {!isOnlyBusinessDriver && (
                <Fragment>
                  <View style={styles.formSubtitle}>
                    <Text varient="caption" color="disabled">
                      บัญชีธนาคาร
                    </Text>
                  </View>
                  <RHFSelectDropdown
                    name="bank"
                    label="ธนาคาร*"
                    disabled={!isApproved || isPendingReview}
                    options={BANKPROVIDER}
                    value={values.bank}
                    labelField="label"
                    valueField="value"
                  />
                  <RHFTextInput
                    disabled={!isApproved || isPendingReview}
                    name="bankBranch"
                    label="สาขา*"
                  />
                  <RHFTextInput
                    disabled={!isApproved || isPendingReview}
                    name="bankName"
                    label="ชื่อบัญชี*"
                  />
                  <RHFTextInput
                    disabled={!isApproved || isPendingReview}
                    name="bankNumber"
                    label="เลขที่บัญชี*"
                  />
                </Fragment>
              )}

              <View style={styles.formSubtitle}>
                <Text varient="caption" color="disabled">
                  เลือกประเภทรถที่ให้บริการ
                </Text>
                <CustomTextInput
                  multiline={isAgent}
                  onPress={handleSelectedVehicle}
                  value={reduce(
                    values.serviceVehicleTypes,
                    (prev, curr) => {
                      const vehicle = find(vehicleTypes, ["_id", curr]);
                      if (vehicle) {
                        const vehicleName = vehicle.name;
                        return prev ? `${prev},\n${vehicleName}` : vehicleName;
                      }
                      return prev;
                    },
                    ""
                  )}
                  label="ประเภทรถที่ให้บริการ"
                  disabled
                  error={!!errors.serviceVehicleTypes}
                  helperText={errors.serviceVehicleTypes?.message}
                  right={
                    <TextInput.Icon
                      icon={({ color, size }) => (
                        <Iconify
                          icon="system-uicons:plus"
                          color={color || colors.text.primary}
                          size={size}
                        />
                      )}
                    />
                  }
                />
              </View>
              {!isAgent && (
                <>
                  <RHFSelectDropdown
                    name="licensePlateProvince"
                    label="จังหวัดทะเบียนรถ*"
                    disabled={!isApproved || isPendingReview}
                    options={prvinces?.getProvince || []}
                    labelField="nameTh"
                    valueField="nameTh"
                    value={values.licensePlateProvince}
                  />
                  <RHFTextInput
                    disabled={!isApproved || isPendingReview}
                    name="licensePlateNumber"
                    label="หมายเลขทะเบียนรถ*"
                  />
                </>
              )}

              <View style={styles.actionWrapper}>
                <Button
                  fullWidth
                  title="บันทึกการเปลี่ยนแปลง"
                  size="large"
                  onPress={handleSubmit(onSubmit)}
                  disabled={!isApproved || isPendingReview}
                  loading={updateLoading}
                />
              </View>
            </FormProvider>
          </View>
        </SafeAreaView>
      </View>
      <VehicleSelectorModal
        multiple={isAgent}
        ref={bottomSheetModalRef}
        onSelected={handleOnSelectedVehicleModal}
        value={values.serviceVehicleTypes}
      />
      <ConfirmDialog open={open} setOpen={setOpen} />
    </Fragment>
  );
}

function PendingReview() {
  return (
    <View style={styles.infoTextContainer}>
      <View style={styles.infoTextWrapper}>
        <Iconify
          icon="iconoir:warning-circle-solid"
          size={normalize(18)}
          color={colors.warning.dark}
          style={styles.iconWrapper}
        />
        <Text varient="body2" style={styles.infoText}>
          โปรไฟล์ของคุณกำลังอยู่ระหว่างการตรวจสอบ
          ไม่สามารถแก้ไขข้อมูลได้ในขณะนี้
        </Text>
      </View>
    </View>
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
