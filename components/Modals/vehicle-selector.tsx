import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import Text from "@components/Text";
import { StyleSheet, View } from "react-native";
import { includes, isEmpty, map } from "lodash";
import { normalize } from "@utils/normalizeSize";
import {
  useGetVehicleTypeAvailableQuery,
  VehicleType,
} from "@/graphql/generated/graphql";
import colors from "@constants/colors";
import { ListRenderItemInfo } from "@shopify/flash-list";
import { ActivityIndicator } from "react-native-paper";
import Iconify from "../Iconify";
import ButtonIcon from "../ButtonIcon";
import {
  BottomSheetFlashList,
  BottomSheetModal,
  BottomSheetView,
  TouchableHighlight,
} from "@gorhom/bottom-sheet";
import SheetBackdrop from "../Sheets/SheetBackdrop";

interface VehicleSelectorModalProps {
  onSelected: (value: string[]) => void;
  value: string[]; // String of Vehicle _id
  multiple?: boolean;
}

export interface VehicleSelectorRef {
  present: Function;
  close: Function;
}

export default forwardRef<VehicleSelectorRef, VehicleSelectorModalProps>(
  ({ onSelected, value, multiple }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const [selectedValue, setSelectedValue] = useState<string[]>([]);

    const {
      data: vehicleData,
      called,
      loading,
    } = useGetVehicleTypeAvailableQuery();

    const vehicleTypes = useMemo<VehicleType[]>(() => {
      if (vehicleData?.getVehicleTypeAvailable) {
        return map(vehicleData.getVehicleTypeAvailable, (vehi) => ({
          ...vehi,
          name: `${vehi.name}${vehi.isConfigured ? "" : " (ยังไม่เปิดให้บริการ)"}`,
        })) as VehicleType[];
      }
      return [];
    }, [vehicleData]);

    function handlePresent() {
      if (bottomSheetModalRef.current) {
        bottomSheetModalRef.current?.present();
      }
    }

    function handleCloseModal() {
      if (bottomSheetModalRef.current) {
        bottomSheetModalRef.current?.close();
      }
    }

    useImperativeHandle(ref, () => ({
      present: handlePresent,
      close: handleCloseModal,
    }));

    const handleOnSelected = useCallback(() => {
      onSelected(selectedValue);
      handleCloseModal();
    }, [selectedValue]);

    const handleOnClose = useCallback(() => {
      setSelectedValue(value); // Reset value
      handleCloseModal();
    }, [selectedValue]);

    const _handleOnSelect = useCallback(
      (id: string) => {
        if (multiple) {
          const isExisting = includes(selectedValue, id);
          const newSelected = isExisting
            ? selectedValue.filter((item) => item !== id) // Remove the item immutably
            : [...selectedValue, id]; // Add the item immutably
          setSelectedValue(newSelected); // Set the new state
        } else {
          setSelectedValue([id]);
        }
      },
      [selectedValue]
    );

    function _HeaderAction() {
      return (
        <View style={styles.headerWrapper}>
          <ButtonIcon onPress={handleOnClose} varient="text" color="inherit">
            {({ color }) => (
              <Iconify icon="icon-park-outline:close-small" color={color} />
            )}
          </ButtonIcon>
          <View style={styles.headerTitle}>
            <Text varient="body1">ประเภทรถที่ให้บริการ</Text>
            <Text varient="caption" color="secondary">
              {multiple ? "ท่านสามารถเลือกได้มากกว่า 1" : "เลือกประเภทรถให้บริการ"}
            </Text>
          </View>
          <ButtonIcon
            varient="text"
            onPress={handleOnSelected}
            disabled={isEmpty(selectedValue)}
          >
            {({ color }) => (
              <Iconify icon="iconamoon:check-bold" color={color} />
            )}
          </ButtonIcon>
        </View>
      );
    }

    function _FooterAction() {
      if (!called || loading) {
        return (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="small" color={colors.text.secondary} />
          </View>
        );
      }
      if (isEmpty(vehicleTypes)) {
        <View style={styles.loadingWrapper}>
          <Text color="secondary">ไม่พบประเภทรถ</Text>
        </View>;
      }
    }

    function _RenderItem({ item, extraData }: ListRenderItemInfo<VehicleType>) {
      const isActive = includes(extraData, item._id);
      return (
        <VehicleItem
          vehicle={item}
          isActive={isActive}
          onPress={() => _handleOnSelect(item._id)}
        />
      );
    }

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === 0) {
          console.log("handleSheetChanges: Open", index);
          // Open
        } else {
          console.log("handleSheetChanges:", index);
          setSelectedValue(value); // Reset value
          // Closed
        }
      },
      [value, selectedValue]
    );

    return (
      <BottomSheetModal
        detached
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        snapPoints={["100%"]}
        backdropComponent={SheetBackdrop.Normal}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.container}>
          <BottomSheetFlashList
            scrollEnabled
            data={vehicleTypes}
            extraData={selectedValue}
            estimatedItemSize={normalize(42)}
            ListHeaderComponent={_HeaderAction}
            ListFooterComponent={_FooterAction}
            renderItem={_RenderItem}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(item, indx) => `${indx}-${item._id}`}
          />
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

interface VehicleItemProps {
  vehicle: VehicleType;
  onPress: VoidFunction;
  isActive: boolean;
}

function VehicleItem({ vehicle, onPress, isActive }: VehicleItemProps) {
  return (
    <TouchableHighlight
      style={styles.itemContainer}
      underlayColor={colors.grey[100]}
      onPress={onPress}
    >
      <BottomSheetView style={styles.itemWrapper}>
        <BottomSheetView style={styles.textWrapper}>
          <Text varient={isActive ? "subtitle1" : "body1"}>
            {vehicle.name}
            {vehicle.isPublic ? "" : " (ยังไม่เปิดให้บริการ)"}
          </Text>
        </BottomSheetView>
        <BottomSheetView style={styles.checkWrapper}>
          {isActive && (
            <Iconify
              icon="gg:check"
              color={colors.primary.main}
              size={normalize(24)}
            />
          )}
        </BottomSheetView>
      </BottomSheetView>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.neutral,
  },
  wrapper: {
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: colors.background.default,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    borderBottomWidth: 1,
    borderColor: colors.divider,
    marginBottom: normalize(8),
  },
  headerTitle: {
    textAlign: "center",
    alignItems: "center",
  },
  itemContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
  },
  textWrapper: {
    flex: 1,
  },
  itemWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  checkWrapper: {
    flex: 0,
  },
  loadingWrapper: {
    padding: normalize(24),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {},
});
