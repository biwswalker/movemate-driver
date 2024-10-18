import Button from "@/components/Button";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import {
  Transaction,
  useGetTransactionQuery,
} from "@/graphql/generated/graphql";
import { normalize } from "@/utils/normalizeSize";
import { fNumber } from "@/utils/number";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { router } from "expo-router";
import { isEmpty } from "lodash";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FinanceList() {
  const [hasMore, setHasMore] = useState(false);
  const { data, loading, fetchMore } = useGetTransactionQuery({
    variables: { limit: 10, skip: 0 },
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  const transactions = useMemo(
    () => data?.getTransaction || [],
    [data?.getTransaction]
  );

  function handleOnClose() {
    if (router.canDismiss()) {
      router.dismiss();
    }
  }

  function loadMoreTransaction() {
    fetchMore({
      variables: { skip: transactions.length },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.getTransaction.length === 0) {
          setHasMore(false);
          return prevResult;
        } else {
          setHasMore(true);
        }
        return {
          ...prevResult,
          ...fetchMoreResult,
          getTransaction: [
            ...prevResult.getTransaction,
            ...fetchMoreResult.getTransaction,
          ],
        };
      },
    });
  }

  function FooterAction() {
    if (isEmpty(transactions)) {
      return (
        <View style={styles.footerWrapper}>
          {/* <Image
            source={require("@assets/images/notfound-shipment.png")}
            style={{ height: normalize(144), objectFit: "contain" }}
          /> */}
          <Text
            varient="subtitle1"
            style={[{ color: colors.primary.darker, textAlign: "center" }]}
          >
            ไม่พบรายการการเงิน
          </Text>
          <Text
            style={[{ paddingTop: 4, textAlign: "center" }]}
            varient="caption"
            color="secondary"
          >{`ไม่มีงานขนส่งใหม่ที่แสดงในขณะนี้\nโปรดตรวจสอบอีกครั้ง`}</Text>
        </View>
      );
    } else if (
      !loading &&
      (transactions.length || 0) < (data?.totalTransaction || 0)
    ) {
      return (
        <View style={styles.footerWrapper}>
          <Button
            title="เพิ่มเติม"
            size="medium"
            varient="soft"
            color="inherit"
            onPress={loadMoreTransaction}
          />
        </View>
      );
    } else {
      return <></>;
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar onBack={handleOnClose} title="รายการการเงิน" />
        <FlashList
          data={transactions}
          renderItem={FinancialItem}
          keyExtractor={(item, indx) => `${indx}-${item._id}`}
          scrollEnabled
          contentContainerStyle={styles.listContainer}
          estimatedItemSize={normalize(112)}
          ListFooterComponent={FooterAction}
        />
      </SafeAreaView>
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
  footerWrapper: {
    alignItems: "center",
    paddingTop: normalize(8),
    paddingBottom: normalize(24),
    paddingHorizontal: normalize(24),
  },
  listContainer: {
    paddingHorizontal: normalize(16),
  },
});

function FinancialItem({ item }: ListRenderItemInfo<Transaction>) {
  return (
    <View style={finStyle.container}>
      <View style={finStyle.trackingNumberWrapper}>
        <Text varient="body2">{item.description}</Text>
      </View>
      <View
        style={[
          finStyle.trackingNumberWrapper,
          { alignItems: "center", paddingTop: normalize(4) },
        ]}
      >
        <Text varient="caption" color="secondary">
          {format(item.createdAt, "EEEE dd MMM yyyy HH:mm", { locale: th })}
        </Text>
        <Text
          varient="h5"
          style={{
            textAlign: "left",
            flexShrink: 0,
            color: colors.success.dark,
          }}
        >
          {fNumber(item.amount, "0,0.0")}
        </Text>
      </View>
    </View>
  );
}

const finStyle = StyleSheet.create({
  container: {
    marginVertical: normalize(4),
    paddingVertical: normalize(8),
    padding: normalize(12),
    borderRadius: normalize(8),
    borderColor: colors.divider,
    borderWidth: normalize(1.5),
  },
  trackingNumberWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});
