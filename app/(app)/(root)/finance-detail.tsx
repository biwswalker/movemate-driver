import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@/constants/colors";
import {
  DriverPayment,
  ERefType,
  ETransactionOwner,
  ETransactionStatus,
  Shipment,
  Transaction,
  useGetDriverTransactionDetailQuery,
} from "@/graphql/generated/graphql";
import { fDateTime } from "@/utils/formatTime";
import { normalize } from "@/utils/normalizeSize";
import { fCurrency } from "@/utils/number";
import { useLocalSearchParams } from "expo-router";
import { get, map } from "lodash";
import { Fragment, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FinancialDetail() {
  const searchParam = useLocalSearchParams<{ transactionId: string }>();
  const transactionId = searchParam.transactionId;

  const { data, loading } = useGetDriverTransactionDetailQuery({
    variables: { transactionId },
  });
  const transaction = useMemo<Transaction | undefined>(
    () =>
      data?.getDriverTransactionDetail.transaction as Transaction | undefined,
    [data]
  );
  // const shipment = useMemo<Shipment | undefined>(
  //   () => data?.getDriverTransactionDetail.shipment as Shipment | undefined,
  //   [data]
  // );
  const driverPayment = useMemo<DriverPayment | undefined>(
    () =>
      data?.getDriverTransactionDetail.driverPayment as
        | DriverPayment
        | undefined,
    [data]
  );

  if (!transaction || loading) {
    return (
      <View style={styles.loaderWrapper}>
        <ActivityIndicator size="small" color={colors.text.secondary} />
      </View>
    );
  }

  const isAgentDriverShipment =
    transaction.ownerType === ETransactionOwner.BUSINESS_DRIVER;

  const isEarned = transaction.refType === ERefType.EARNING;

  const refType = {
    [ERefType.SHIPMENT]: "งานขนส่ง",
    [ERefType.EARNING]: "รับค่าขนส่ง",
    [ERefType.BILLING]: "-",
  };

  console.log("transaction: ", transaction);
  const refTypeText = get(refType, transaction.refType, "");

  const statusTexts = {
    [ETransactionStatus.PENDING]: {
      label: "รอรับเงิน",
      color: colors.warning.dark,
    },
    [ETransactionStatus.COMPLETE]: {
      label: isAgentDriverShipment ? "-" : "ได้รับเงินแล้ว",
      color: isAgentDriverShipment
        ? colors.text.secondary
        : isEarned
          ? colors.success.dark
          : colors.primary.main,
    },
  };
  const statusText = get(statusTexts, transaction.status, undefined);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar title="รายละเอียดการเงิน" />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.contentRow}>
            <View style={styles.contentField}>
              <Text varient="body2">ประเภทรายการ</Text>
              <Text
                varient="body1"
                color="secondary"
                style={{ lineHeight: normalize(20) }}
              >
                {refTypeText}
              </Text>
            </View>
            <View style={styles.contentField}>
              <Text varient="body2">สถานะ</Text>
              <Text
                varient="body1"
                style={{ lineHeight: normalize(20), color: statusText?.color }}
              >
                {statusText?.label}
              </Text>
            </View>
          </View>

          <View style={styles.contentRow}>
            <View style={styles.contentField}>
              <Text varient="body2">รายละเอียด</Text>
              <Text
                varient="body1"
                color="secondary"
                style={{ lineHeight: normalize(20) }}
              >
                {transaction.description}
              </Text>
            </View>
          </View>

          <View style={styles.contentRow}>
            <View style={styles.contentField}>
              <Text varient="body2">เวลา</Text>
              <Text
                varient="body1"
                color="secondary"
                style={{ lineHeight: normalize(20) }}
              >
                {fDateTime(transaction.createdAt)}
              </Text>
            </View>
          </View>

          <View style={styles.contentRow}>
            <View style={styles.contentField}>
              <Text varient="body2">จำนวน</Text>
              {isAgentDriverShipment ? (
                <Text varient="body1" color="secondary">
                  -
                </Text>
              ) : (
                <Text
                  varient="h4"
                  style={{ color: statusText?.color || colors.primary.main }}
                >
                  {fCurrency(transaction.amount)} บาท
                </Text>
              )}
            </View>
          </View>
          {transaction.refType === ERefType.EARNING && (
            <FinancialShipmentDetail driverPayment={driverPayment} />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  textCenter: {
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  wrapper: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(24),
    gap: normalize(16),
  },
  contentRow: {
    flexDirection: "row",
  },
  contentField: {
    flex: 1,
    gap: normalize(4),
  },
  loaderWrapper: {
    alignItems: "center",
    paddingTop: normalize(8),
    paddingBottom: normalize(24),
    paddingHorizontal: normalize(24),
  },
  fillText: {
    gap: normalize(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listWrapper: {
    gap: normalize(6),
  },
});

interface IFinancialDriverPaymentDetailProps {
  driverPayment: DriverPayment | undefined;
}

function FinancialShipmentDetail({
  driverPayment,
}: IFinancialDriverPaymentDetailProps) {
  if (!driverPayment) {
    return <Fragment />;
  }

  const { subtotal, tax, total, transactions } = driverPayment;
  return (
    <Fragment>
      <View style={[{ paddingTop: normalize(16) }]}>
        <View style={styles.contentRow}>
          <View style={styles.contentField}>
            <Text varient="subtitle1">รายละเอียดทำจ่าย</Text>
            <View style={styles.listWrapper}>
              {map(transactions, (transaction, index) => (
                <View
                  style={[styles.fillText, { alignItems: "flex-start" }]}
                  key={`${transaction._id}-${index}`}
                >
                  <Text varient="caption">- {transaction.description}</Text>
                  <Text
                    varient="body2"
                    color="secondary"
                    style={{ minWidth: normalize(88), textAlign: "right" }}
                  >
                    {fCurrency(transaction.amount)}
                  </Text>
                </View>
              ))}
            </View>
            <View style={[styles.fillText, { paddingTop: normalize(12) }]}>
              <Text varient="body1">รวม</Text>
              <Text
                varient="body1"
                style={{ minWidth: normalize(112), textAlign: "right" }}
              >
                {fCurrency(subtotal)}
              </Text>
            </View>
            {tax > 0 && (
              <View style={[styles.fillText, { paddingTop: normalize(4) }]}>
                <Text varient="body1">ภาษีการขนส่ง</Text>
                <Text
                  varient="body1"
                  style={{ minWidth: normalize(112), textAlign: "right" }}
                >
                  -{fCurrency(tax)}
                </Text>
              </View>
            )}
            <View style={[styles.fillText, { paddingTop: normalize(4) }]}>
              <Text varient="subtitle1">ยอดรวมทั้งหมด</Text>
              <Text
                varient="h4"
                style={{ minWidth: normalize(112), textAlign: "right" }}
              >
                {fCurrency(total)} บาท
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Fragment>
  );
}
