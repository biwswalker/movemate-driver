import colors from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { useEffect, useMemo, useRef } from "react";
import {
  EDriverType,
  useGetDistrictLazyQuery,
  useGetProvinceQuery,
  useGetSubDistrictLazyQuery,
  useGetVehicleTypeAvailableQuery,
  useVerifyEmployeeDataMutation,
  VehicleType,
  VerifyEmployeeDataMutation,
} from "@/graphql/generated/graphql";
import Yup from "@/utils/yup";
import { find, forEach, get, isEqual, map, reduce } from "lodash";
import {
  EmployeeDriverFormValue,
  EmployeeDriverFormValueType,
  EmployeeRegisterParam,
} from "@/types/employee";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ApolloError } from "@apollo/client";
import { YUP_VALIDATION_ERROR_TYPE } from "@/constants/error";
import FormProvider from "@/components/HookForm/FormProvider";
import RHFSelectDropdown from "@/components/HookForm/RHFSelectDropdown";
import { TITLE_NAME_OPTIONS } from "@/constants/values";
import RHFTextInput from "@/components/HookForm/RHFTextInput";
import Button from "@/components/Button";
import { normalize } from "@/utils/normalizeSize";
import Text from "@/components/Text";
import VehicleSelectorModal, {
  VehicleSelectorRef,
} from "@/components/Modals/vehicle-selector";
import CustomTextInput from "@components/TextInput";
import { TextInput } from "react-native-paper";
import Iconify from "@/components/Iconify";
interface NewEmployeeFormProps {
  phoneNumber: string;
}

export default function NewEmployeeForm({ phoneNumber }: NewEmployeeFormProps) {
  const bottomSheetModalRef = useRef<VehicleSelectorRef>(null);
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param || "{}") as EmployeeRegisterParam;

  const { data: prvinces, loading: provinceLoading } = useGetProvinceQuery();
  const [getDistrict, { data: district, loading: districtLoading }] =
    useGetDistrictLazyQuery();
  const [getSubDistrict, { data: subDistrict, loading: subDistrictLoading }] =
    useGetSubDistrictLazyQuery();
  const [verifyData, { loading: verifyLoading }] =
    useVerifyEmployeeDataMutation();

  const { data: vehicleData } = useGetVehicleTypeAvailableQuery();
  const vehicleTypes = useMemo<VehicleType[]>(() => {
    if (vehicleData?.getVehicleTypeAvailable) {
      return map(vehicleData.getVehicleTypeAvailable, (vehi) => ({
        ...vehi,
        name: `${vehi.name}${vehi.isConfigured ? "" : " (ยังไม่เปิดให้บริการ)"}`,
      })) as VehicleType[];
    }
    return [];
  }, [vehicleData]);

  const BusinessDriverScema = Yup.object().shape({
    title: Yup.string().required("กรุณาเลือกคำนำหน้าชื่อ"),
    otherTitle: Yup.string().when("title", ([title], schema) =>
      isEqual(title, "อื่นๆ")
        ? schema.required("ระบุคำนำหน้าชื่อ")
        : schema.notRequired()
    ),
    firstname: Yup.string()
      .required("ระบุชื่อ")
      .matches(/^[ก-๙\s]+$/, "ระบุเป็นภาษาไทยเท่านั้น"),
    lastname: Yup.string()
      .required("ระบุนามสกุล")
      .matches(/^[ก-๙\s]+$/, "ระบุเป็นภาษาไทยเท่านั้น"),
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

  const defaultValues: EmployeeDriverFormValue = useMemo(() => {
    const detail = params.detail;
    return {
      title: detail?.title || "",
      otherTitle: detail?.otherTitle || "",
      firstname: detail?.firstname || "",
      lastname: detail?.lastname || "",
      taxNumber: detail?.taxNumber || "",
      lineId: detail?.lineId || "",
      phoneNumber,
      // Address
      address: detail?.address || "",
      province: detail?.province || "",
      district: detail?.district || "",
      subDistrict: detail?.subDistrict || "",
      postcode: detail?.postcode || "",
      serviceVehicleTypes: detail?.serviceVehicleTypes || [],
      licensePlateProvince: detail?.licensePlateProvince || "",
      licensePlateNumber: detail?.licensePlateNumber || "",
    };
  }, []);

  useEffect(() => {
    if (params.detail) {
      const detail = params.detail;
      getDistrict({ variables: { provinceThName: detail.province } });
      getSubDistrict({ variables: { districtName: detail.district } });
    }
  }, []);

  const methods = useForm<EmployeeDriverFormValue>({
    resolver: yupResolver(BusinessDriverScema) as any,
    defaultValues,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    setValue,
    watch,
    setError,
    setFocus,
    clearErrors,
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
                type: DropdownType.Warn,
              });
            }
            forEach(errors, ({ path, ...message }) => setError(path, message));
            setFocus(get(errors, "0.path", ""));
            break;
          default:
            console.log(graphQLError);
            showSnackbar({
              title: "พบข้อผิดพลาด",
              message: graphQLError?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
              type: DropdownType.Warn,
            });
            break;
        }
      });
    } else {
      console.log("error: ", error);
      showSnackbar({
        title: "พบข้อผิดพลาด",
        message: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
        type: DropdownType.Warn,
      });
    }
  }

  function handleVerifySuccess(data: VerifyEmployeeDataMutation) {
    const validatedData = data.verifyEmployeeData;
    const formValue = new EmployeeDriverFormValue(
      validatedData as EmployeeDriverFormValueType
    );
    const param = JSON.stringify(Object.assign(params, { detail: formValue }));
    console.log("postvalidate: => ", JSON.stringify(param, undefined, 2));
    router.push({ pathname: "/employee/documents", params: { param } });
  }

  async function onSubmit(values: EmployeeDriverFormValue) {
    try {
      const submitData = new EmployeeDriverFormValue(values);
      console.log("prevalidate: => ", JSON.stringify(submitData, undefined, 2));
      verifyData({
        variables: { data: submitData },
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
    console.log("vehicles: ", vehicles);
    setValue("serviceVehicleTypes", vehicles);
  }

  return (
    <View style={styles.container}>
      <FormProvider
        methods={methods}
        containerStyle={styles.inputWrapper}
        // extraScrollHeight={120}
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
            getDistrict({ variables: { provinceThName: province.nameTh } });
            setValue("province", province.nameTh);
            setValue("district", "");
            setValue("subDistrict", "");
            setValue("postcode", "");
            clearErrors("province");
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
            getSubDistrict({ variables: { districtName: district.nameTh } });
            setValue("district", district.nameTh);
            setValue("subDistrict", "");
            setValue("postcode", "");
            clearErrors("district");
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
            const subDistrictData = find(subDistrict?.getSubDistrict || [], [
              "nameTh",
              subdistrict.nameTh,
            ]);
            setValue("subDistrict", subdistrict.nameTh);
            setValue("postcode", `${subDistrictData?.zipCode}` || "");
            clearErrors(["subDistrict", "postcode"]);
          }}
        />
        <RHFTextInput name="postcode" label="รหัสไปรษณีย์*" readOnly />
        <View style={[styles.formSubtitle, { paddingLeft: 0 }]}>
          <Text varient="caption" color="disabled">
            เลือกประเภทรถที่ให้บริการ
          </Text>
          <CustomTextInput
            // multiline
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
        <RHFTextInput name="licensePlateNumber" label="หมายเลขทะเบียนรถ*" />
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
      <VehicleSelectorModal
        ref={bottomSheetModalRef}
        onSelected={handleOnSelectedVehicleModal}
        value={values.serviceVehicleTypes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  inputWrapper: {},
  formSubtitle: { paddingTop: normalize(32), paddingLeft: 8 },
  actionWrapper: { paddingVertical: normalize(32) },
});
