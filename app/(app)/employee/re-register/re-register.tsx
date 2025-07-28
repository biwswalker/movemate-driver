import Button from "@/components/Button";
import FormProvider from "@/components/HookForm/FormProvider";
import RHFSelectDropdown from "@/components/HookForm/RHFSelectDropdown";
import RHFTextInput from "@/components/HookForm/RHFTextInput";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import { YUP_VALIDATION_ERROR_TYPE } from "@/constants/error";
import { TITLE_NAME_OPTIONS } from "@/constants/values";
import {
  DriverDetail,
  useGetDistrictLazyQuery,
  useGetProvinceQuery,
  useGetSubDistrictLazyQuery,
  useGetUserQuery,
  useGetVehicleTypeAvailableQuery,
  useVerifyEmployeeDataMutation,
  VehicleType,
  VerifyEmployeeDataMutation,
} from "@/graphql/generated/graphql";
import { normalize } from "@/utils/normalizeSize";
import Yup from "@/utils/yup";
import { ApolloError } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { find, forEach, get, isEqual, map, reduce } from "lodash";
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
  EmployeeRegisterParam,
} from "@/types/employee-re-register";

type FormValues = DriverFormValueType;

export default function ReRegister() {
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const bottomSheetModalRef = useRef<VehicleSelectorRef>(null);
  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param || "{}") as EmployeeRegisterParam;
  const driverId = get(params, "id", "");

  const { data, refetch } = useGetUserQuery({
    variables: { id: driverId },
    fetchPolicy: "network-only",
  });
  const user = useMemo(() => data?.getUser, [data]);

  useFocusEffect(() => {
    refetch();
  });

  const { data: vehicleData } = useGetVehicleTypeAvailableQuery();
  const { data: prvinces, loading: provinceLoading } = useGetProvinceQuery();
  const [getDistrict, { data: district, loading: districtLoading }] =
    useGetDistrictLazyQuery();
  const [getSubDistrict, { data: subDistrict, loading: subDistrictLoading }] =
    useGetSubDistrictLazyQuery();
  const [verifyData, { loading: verifyLoading }] =
    useVerifyEmployeeDataMutation();

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

  const EmployeeScema = Yup.object().shape({
    title: Yup.string().required("กรุณาเลือกคำนำหน้าชื่อ"),
    otherTitle: Yup.string().when("title", ([title], schema) =>
      isEqual(title, "อื่นๆ")
        ? schema.required("ระบุคำนำหน้าชื่อ")
        : schema.notRequired()
    ),
    firstname: Yup.string().required("ระบุชื่อ"),
    lastname: Yup.string().required("ระบุนามสกุล"),
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
    serviceVehicleTypes: Yup.array().min(1, "ระบุประเภทรถที่ให้บริการ"),
    licensePlateProvince: Yup.string().required("ระบุจังหวัดทะเบียนรถ"),
    licensePlateNumber: Yup.string().required("ระบุหมายเลขทะเบียนรถ"),
  });

  const defaultValues: FormValues = {
    title: driverDetail?.title || "",
    otherTitle: driverDetail?.otherTitle || "",
    firstname: driverDetail?.firstname || "",
    lastname: driverDetail?.lastname || "",
    taxNumber: driverDetail?.taxNumber || "",
    phoneNumber: driverDetail?.phoneNumber || "",
    lineId: driverDetail?.lineId || "",
    // Address
    address: driverDetail?.address || "",
    province: driverDetail?.province || "",
    district: driverDetail?.district || "",
    subDistrict: driverDetail?.subDistrict || "",
    postcode: driverDetail?.postcode || "",
    // Vehicle type
    serviceVehicleTypes: map(
      driverDetail?.serviceVehicleTypes,
      (service) => service._id
    ),
    licensePlateProvince: driverDetail?.licensePlateProvince || "",
    licensePlateNumber: driverDetail?.licensePlateNumber || "",
  };

  const methods = useForm<FormValues>({
    resolver: yupResolver(EmployeeScema) as any,
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

  function handleVerifySuccess(data: VerifyEmployeeDataMutation) {
    console.log(
      "Post verify",
      JSON.stringify(data.verifyEmployeeData, undefined, 2)
    );
    const validatedData = data.verifyEmployeeData;
    const formValue = new DriverFormValue(validatedData as DriverFormValueType);
    const param = JSON.stringify(Object.assign(params, { detail: formValue }));
    router.push({
      pathname: "/employee/re-register/re-document",
      params: { param },
    });
  }

  async function onSubmit(values: FormValues) {
    try {
      const submitData = new DriverFormValue({
        title: values.title,
        otherTitle: values.otherTitle,
        firstname: values.firstname,
        lastname: values.lastname,
        taxNumber: values.taxNumber,
        phoneNumber: values.phoneNumber,
        lineId: values.lineId,
        address: values.address,
        province: values.province,
        district: values.district,
        subDistrict: values.subDistrict,
        postcode: values.postcode,
        serviceVehicleTypes: values.serviceVehicleTypes,
        licensePlateProvince: values.licensePlateProvince,
        licensePlateNumber: values.licensePlateNumber,
      });
      console.log("Pre verify", JSON.stringify(submitData, undefined, 2));
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
          <NavigationBar title="แก้ไขข้อมูลคนขับ" />
          <View style={styles.content}>
            <FormProvider
              methods={methods}
              containerStyle={styles.inputWrapper}
            >
              <RHFSelectDropdown
                name="title"
                label="คำนำหน้าชื่อ*"
                options={TITLE_NAME_OPTIONS}
                value={values.title}
                labelField="label"
                valueField="value"
              />
              {values.title === "อื่นๆ" && (
                <RHFTextInput name="otherTitle" label="ระบุคำนำหน้าชื่อ*" />
              )}
              <RHFTextInput name="firstname" label="ชื่อ*" />
              <RHFTextInput name="lastname" label="นามสกุล*" />
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

              <View style={styles.formSubtitle}>
                <Text varient="caption" color="disabled">
                  เลือกประเภทรถที่ให้บริการ
                </Text>
                <CustomTextInput
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
              <RHFSelectDropdown
                name="licensePlateProvince"
                label="จังหวัดทะเบียนรถ*"
                options={prvinces?.getProvince || []}
                labelField="nameTh"
                valueField="nameTh"
                value={values.licensePlateProvince}
              />
              <RHFTextInput
                name="licensePlateNumber"
                label="หมายเลขทะเบียนรถ*"
              />
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
