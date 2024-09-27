import { ProgressingStepsProps } from "./ProgressingStep";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { normalize } from "@/utils/normalizeSize";
import Text from "@/components/Text";
import ButtonIcon from "@/components/ButtonIcon";
import Iconify from "@/components/Iconify";
import colors from "@/constants/colors";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { get } from "lodash";
import * as Linking from "expo-linking";
import Button from "@/components/Button";
import { useConfirmShipmentDatetimeMutation } from "@/graphql/generated/graphql";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, parse } from "date-fns";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { DropdownAlertType } from "react-native-dropdownalert";
import hexToRgba from "hex-to-rgba";

export function ProgressConfirmDatetime({
  shipment,
  refetch,
  step,
  index,
}: ProgressingStepsProps) {
  const { showSnackbar } = useSnackbarV2();
  const [confirmShipmentDatetime, { loading }] =
    useConfirmShipmentDatetimeMutation();
  const datetime = new Date(shipment?.bookingDateTime || "");

  const [pickedDate, setPickDate] = useState<Date>(datetime);
  const [pickedTime, setPickTime] = useState<Date>(datetime);

  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  const customer = useMemo(() => shipment.customer, [shipment]);
  const branch = get(customer, "businessDetail.businessBranch", "");

  function handleCallToCustomer() {
    if (customer) {
      const phoneNumber =
        customer.userType === "individual"
          ? get(customer, "individualDetail.phoneNumber", "")
          : customer.userType === "business"
            ? get(customer, "businessDetail.contactNumber", "")
            : "";
      if (phoneNumber) {
        Linking.openURL(`tel:${phoneNumber}`);
      }
    }
  }

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

  function handleConfirmDatetime() {
    const date = parse(
      `${format(pickedDate, "dd/MM/yyyy")} ${format(pickedTime, "HH:mm")}`,
      "dd/MM/yyyy HH:mm",
      new Date()
    );
    confirmShipmentDatetime({
      variables: {
        data: { shipmentId: shipment._id, datetime: date.toISOString() },
      },
      onError: handleConfirmError,
      onCompleted: handleConfirmComplete,
    });
  }

  function handleOnShowDatePicker() {
    setOpenDate(true);
  }

  function handleOnShowTimePicker() {
    setOpenTime(true);
  }

  const handleOnChangeDate = useCallback((date?: Date) => {
    if (date) {
      setPickDate(date);
    }
  }, []);

  const handleOnChangeTime = useCallback((date?: Date) => {
    if (date) {
      setPickTime(date);
    }
  }, []);

  return (
    <ScrollView style={progressStyles.wrapper}>
      <Text varient="body2" color="secondary">
        ข้อมูลการติดต่อ
      </Text>
      <View style={progressStyles.contactWrapper}>
        <View style={progressStyles.contactNameWrapper}>
          <Text varient="subtitle1">
            {customer.fullname}
            {branch ? ` (${customer.businessDetail?.businessName})` : ""}
          </Text>
          <Text varient="body1">
            {customer?.userType === "individual"
              ? customer.individualDetail?.phoneNumber
              : customer?.userType === "business"
                ? customer.businessDetail?.contactNumber
                : ""}
          </Text>
        </View>
        <View style={progressStyles.contactIcon}>
          <ButtonIcon
            circle
            varient="soft"
            color="secondary"
            onPress={handleCallToCustomer}
          >
            <Iconify
              icon="tabler:phone"
              size={24}
              color={colors.secondary.main}
            />
          </ButtonIcon>
        </View>
      </View>
      <View style={progressStyles.datepickerWrapper}>
        <Text varient="body2" color="secondary">
          เวลานัดหมาย
        </Text>
        <View style={progressStyles.datepickerInput}>
          <TouchableHighlight
            style={progressStyles.pickerWrapper}
            onPress={handleOnShowDatePicker}
          >
            {/* pickedDate */}
            <View style={progressStyles.pickerButton}>
              <Text varient="caption" color="secondary">
                วันที่
              </Text>
              <Text>{format(pickedDate, "dd/MM/yyyy")}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={progressStyles.pickerWrapper}
            onPress={handleOnShowTimePicker}
          >
            {/* pickedTime */}
            <View style={progressStyles.pickerButton}>
              <Text varient="caption" color="secondary">
                เวลา
              </Text>
              <Text>{format(pickedTime, "HH:mm")}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
      <View style={progressStyles.actionsWrapper}>
        <Button
          size="large"
          title="นัดหมายเวลาและยืนยันแล้ว"
          fullWidth
          loading={loading}
          disabled={!pickedDate && !pickedTime}
          onPress={handleConfirmDatetime}
        />
      </View>
      <DatepickerDialog
        open={openDate}
        date={pickedDate}
        display="inline"
        mode="date"
        onDatetimeChange={handleOnChangeDate}
        setOpen={setOpenDate}
      />
      <DatepickerDialog
        open={openTime}
        date={pickedTime}
        mode="time"
        display="spinner"
        onDatetimeChange={handleOnChangeTime}
        setOpen={setOpenTime}
      />
    </ScrollView>
  );
}

const progressStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(16),
    gap: normalize(2),
    // flex: 1,
  },
  contactNameWrapper: {
    flex: 1,
  },
  contactWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: normalize(8),
    paddingTop: normalize(2),
  },
  contactIcon: {
    paddingTop: normalize(4),
  },
  datepickerWrapper: {
    paddingTop: normalize(16),
    gap: normalize(8),
  },
  datepickerInput: {
    flexDirection: "row",
    gap: normalize(8),
  },
  actionsWrapper: {
    // width: "100%",
    paddingTop: normalize(24),
  },
  pickerWrapper: {
    flex: 1,
    borderRadius: normalize(8),
  },
  pickerButton: {
    backgroundColor: colors.background.neutral,
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(8),
    borderRadius: normalize(8),
  },
});

interface IConfirmDialogProps {
  open: boolean;
  date: Date;
  mode: "date" | "time";
  display: "default" | "inline" | "spinner";
  onDatetimeChange: (datetime: Date) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function DatepickerDialog({
  open,
  setOpen,
  onDatetimeChange,
  date,
  mode,
  display,
}: IConfirmDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };

  const onChange = (_event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    onDatetimeChange(currentDate);
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
          <DateTimePicker
            themeVariant="light"
            display={display}
            testID="dateTimePicker"
            value={date}
            mode={mode}
            onChange={onChange}
          />
          <View style={modalStyle.actionWrapper}>
            <Button
              fullWidth
              size="medium"
              title="ปิด"
              varient="soft"
              color="inherit"
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
    paddingHorizontal: normalize(8),
    paddingBottom: normalize(8),
    borderRadius: normalize(8),
  },
  actionWrapper: {
    paddingTop: normalize(8),
  },
});

export function DoneConfirmDatetime({
  shipment,
}: ProgressingStepsProps) {
  const datetime = new Date(shipment?.bookingDateTime || "");
  const customer = useMemo(() => shipment.customer, [shipment]);
  const branch = get(customer, "businessDetail.businessBranch", "");

  function handleCallToCustomer() {
    if (customer) {
      const phoneNumber =
        customer.userType === "individual"
          ? get(customer, "individualDetail.phoneNumber", "")
          : customer.userType === "business"
            ? get(customer, "businessDetail.contactNumber", "")
            : "";
      if (phoneNumber) {
        Linking.openURL(`tel:${phoneNumber}`);
      }
    }
  }

  return (
    <View style={doneStyles.wrapper}>
      <Text varient="body2" color="secondary">
        ข้อมูลการติดต่อ
      </Text>
      <View style={doneStyles.contactWrapper}>
        <View style={doneStyles.contactNameWrapper}>
          <Text varient="subtitle1">
            {customer.fullname}
            {branch ? ` (${customer.businessDetail?.businessName})` : ""}
          </Text>
          <Text varient="body1">
            {customer?.userType === "individual"
              ? customer.individualDetail?.phoneNumber
              : customer?.userType === "business"
                ? customer.businessDetail?.contactNumber
                : ""}
          </Text>
        </View>
        <View style={doneStyles.contactIcon}>
          <ButtonIcon
            circle
            varient="soft"
            color="secondary"
            onPress={handleCallToCustomer}
          >
            <Iconify
              icon="tabler:phone"
              size={24}
              color={colors.secondary.main}
            />
          </ButtonIcon>
        </View>
      </View>
      <View style={doneStyles.datepickerWrapper}>
        <Text varient="body2" color="secondary">
          เวลานัดหมาย
        </Text>
        <View style={doneStyles.datepickerInput}>
          <View style={doneStyles.pickerButton}>
            <Text varient="caption" color="secondary">
              วันที่
            </Text>
            <Text>{format(datetime, "dd/MM/yyyy")}</Text>
          </View>
          <View style={doneStyles.pickerButton}>
            <Text varient="caption" color="secondary">
              เวลา
            </Text>
            <Text>{format(datetime, "HH:mm")}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const doneStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(16),
    gap: normalize(2),
    // flex: 1,
  },
  contactNameWrapper: {
    flex: 1,
  },
  contactWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: normalize(8),
    paddingTop: normalize(2),
  },
  contactIcon: {
    paddingTop: normalize(4),
  },
  datepickerWrapper: {
    paddingTop: normalize(16),
    gap: normalize(8),
  },
  datepickerInput: {
    flexDirection: "row",
    gap: normalize(8),
  },
  pickerButton: {
    backgroundColor: colors.background.neutral,
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(8),
    borderRadius: normalize(8),
    flex: 1,
  },
});
