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
  EUserType,
  useGetDistrictLazyQuery,
  useGetProvinceQuery,
  useGetSubDistrictLazyQuery,
  useGetVehicleTypeAvailableQuery,
  useVerifyDriverDataMutation,
  VehicleType,
  VerifyDriverDataMutation,
} from "@/graphql/generated/graphql";
import useAuth from "@/hooks/useAuth";
import { normalize } from "@/utils/normalizeSize";
import Yup from "@/utils/yup";
import { ApolloError } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
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
import { Fragment, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTextInput from "@components/TextInput";
import { TextInput } from "react-native-paper";
import Iconify from "@/components/Iconify";
import VehicleSelectorModal, {
  VehicleSelectorRef,
} from "@/components/Modals/vehicle-selector";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import {
  DriverFormValue,
  DriverFormValueType,
  IndividualRegisterParam,
} from "@/types/re-register";

type FormValues = Omit<
  DriverFormValueType,
  "password" | "policyVersion" | "driverType"
>;

export default function ReRegister() {
  const bottomSheetModalRef = useRef<VehicleSelectorRef>(null);
  const { user, refetchMe } = useAuth();
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(
    searchParam.param || "{}"
  ) as IndividualRegisterParam;

  const isAgent = user?.userType === EUserType.BUSINESS;
  const isOnlyBusinessDriver = useMemo(() => {
    const driverTypes = get(user, "driverDetail.driverType", []);
    if (driverTypes.length > 1) {
      return false;
    } else if (includes(driverTypes, EDriverType.BUSINESS_DRIVER)) {
      return true;
    }
    return false;
  }, [user?.driverDetail]);

  useFocusEffect(() => {
    refetchMe();
  });

  const { data: vehicleData } = useGetVehicleTypeAvailableQuery();
  const { data: prvinces, loading: provinceLoading } = useGetProvinceQuery();
  const [getDistrict, { data: district, loading: districtLoading }] =
    useGetDistrictLazyQuery();
  const [getSubDistrict, { data: subDistrict, loading: subDistrictLoading }] =
    useGetSubDistrictLazyQuery();
  const [verifyData, { loading: verifyLoading }] =
    useVerifyDriverDataMutation();

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

  useEffect(() => {
    if (params.detail) {
      const detail = params.detail;
      getDistrict({ variables: { provinceThName: detail.province } });
      getSubDistrict({ variables: { districtName: detail.district } });
    }
  }, []);

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
                title: "ไม่สามารถบันทึกได้",
                message: `ไม่สามารถดำเนินการต่อได้พบ ${errorlength} ข้อผิดพลาด`,
                type: DropdownType.Warn,
              });
            }
            forEach(errors, ({ path, ...message }) => setError(path, message));
            setFocus(get(errors, "0.path", ""));
            break;
          default:
            showSnackbar({
              title: "เกิดข้อผิดพลาด",
              message: `กรุณาลองใหม่`,
              type: DropdownType.Warn,
            });
            break;
        }
      });
    } else {
      console.log("error: ", error);
      showSnackbar({
        title: "เกิดข้อผิดพลาด",
        message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
        type: DropdownType.Warn,
      });
    }
  }

  function handleVerifySuccess(data: VerifyDriverDataMutation) {
    const validatedData = data.verifyDriverData;
    const formValue = new DriverFormValue(validatedData as DriverFormValueType);
    const param = JSON.stringify(Object.assign(params, { detail: formValue }));
    router.push({ pathname: "/re-register/re-document", params: { param } });
  }

  async function onSubmit(values: FormValues) {
    try {
      const submitData = new DriverFormValue({
        policyVersion: user?.acceptPolicyVersion || 0,
        driverType:
          (driverDetail?.driverType || []).length > 1
            ? EDriverType.INDIVIDUAL_DRIVER
            : (driverDetail?.driverType || [])[0] ||
              EDriverType.INDIVIDUAL_DRIVER,
        title: values.title,
        otherTitle: values.otherTitle,
        firstname: values.firstname,
        lastname: values.lastname,
        businessName: values.businessName,
        businessBranch: values.businessBranch,
        taxNumber: values.taxNumber,
        phoneNumber: values.phoneNumber,
        lineId: values.lineId,
        password: "noneofpassw0rd",
        address: values.address,
        province: values.province,
        district: values.district,
        subDistrict: values.subDistrict,
        postcode: values.postcode,
        bank: values.bank,
        bankBranch: values.bankBranch,
        bankName: values.bankName,
        bankNumber: values.bankNumber,
        serviceVehicleTypes: values.serviceVehicleTypes,
      });
      verifyData({
        variables: {
          data: submitData,
          driverId: user?._id,
        },
        onCompleted: handleVerifySuccess,
        onError: handleErrorVerified,
      });
    } catch (error) {}
  }

  function handleSelectedVehicle() {
    if (bottomSheetModalRef.current) {
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
            <FormProvider
              methods={methods}
              containerStyle={styles.inputWrapper}
            >
              <RHFSelectDropdown
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
                <RHFTextInput name="otherTitle" label="ระบุคำนำหน้าชื่อ*" />
              )}
              {isAgent ? (
                <Fragment>
                  <RHFTextInput name="businessName" label="ชื่อบริษัท*" />
                  <RHFTextInput name="businessBranch" label="สาขา" />
                </Fragment>
              ) : (
                <Fragment>
                  <RHFTextInput name="firstname" label="ชื่อ*" />
                  <RHFTextInput name="lastname" label="นามสกุล*" />
                </Fragment>
              )}
              <RHFTextInput
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
                disabled
                name="phoneNumber"
                label="เบอร์โทรศัพท์*"
                helperText={
                  errors.phoneNumber
                    ? errors.phoneNumber.message
                    : "กรอกเป็นตัวเลขไม่เกิน 10 ตัวเท่านั้น"
                }
              />
              <RHFTextInput name="lineId" label="ไลน์ไอดี" />

              <View style={styles.formSubtitle}>
                <Text varient="caption" color="disabled">
                  ข้อมูลที่อยู่ปัจจุบัน
                </Text>
              </View>
              <RHFTextInput name="address" label="ที่อยู่*" />
              <RHFSelectDropdown
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
                disabled={!values.province}
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
                disabled={!values.district}
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
              <RHFTextInput name="postcode" label="รหัสไปรษณีย์*" readOnly />
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
                    options={BANKPROVIDER}
                    value={values.bank}
                    labelField="label"
                    valueField="value"
                  />
                  <RHFTextInput name="bankBranch" label="สาขา*" />
                  <RHFTextInput name="bankName" label="ชื่อบัญชี*" />
                  <RHFTextInput name="bankNumber" label="เลขที่บัญชี*" />
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
                        return prev ? `${prev}, ${vehicleName}` : vehicleName;
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

              <View style={styles.actionWrapper}>
                <Button
                  fullWidth
                  title="ดำเนินการต่อ"
                  size="large"
                  onPress={handleSubmit(onSubmit)}
                  loading={verifyLoading}
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
});
