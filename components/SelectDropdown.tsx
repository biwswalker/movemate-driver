import React, { Fragment, ReactNode, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Text, { getFontVarient } from "./Text";
import hexToRgba from "hex-to-rgba";
import colors from "@constants/colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginVertical: 8,
  },
  dropdown: {
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: hexToRgba(colors.grey[500], 0.08),
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    left: 8,
    top: 10,
    zIndex: 999,
    paddingHorizontal: 8,
    ...getFontVarient("caption"),
    color: colors.text.disabled,
  },
  placeholderStyle: {
    ...getFontVarient("body1"),
    color: colors.text.disabled,
  },
  selectedTextStyle: {
    ...getFontVarient("body1"),
    transform: [{ translateY: 8 }],
    color: colors.text.primary,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemTextStyle: {
    ...getFontVarient("body1"),
  },
  helperText: {
    color: colors.text.secondary,
    marginTop: 8,
    paddingLeft: 12,
  },
  helperTextError: {
    color: colors.error.main,
  },
});

export interface DropdownInputProps<T = any> {
  options: T[];
  value: string;
  valueField: keyof T;
  labelField: keyof T;
  label?: string;
  helperText?: string | ((error: boolean) => ReactNode) | undefined;
  disabled?: boolean;
  onChanged?: (value: T) => void;
  error?: boolean;
  dropdownPosition?: "auto" | "top" | "bottom";
}

export default function SelectDropdown<T = any>({
  helperText,
  options,
  value,
  label = "",
  onChanged = () => {},
  valueField,
  labelField,
  disabled,
  error,
  dropdownPosition = "auto",
}: DropdownInputProps<T>) {
  const datas = useMemo(() => options || [], [options]);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value) {
      return (
        <Text varient="caption" color="secondary" style={styles.label}>
          {label}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container]}>
      {renderLabel()}
      <Dropdown
        dropdownPosition={dropdownPosition}
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={styles.itemTextStyle}
        maxHeight={300}
        placeholder={label}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        value={value}
        data={datas as any}
        valueField={valueField}
        labelField={labelField}
        disable={disabled}
        onChange={onChanged}
      />
      {typeof helperText === "string" ? (
        <Text
          varient="caption"
          style={[styles.helperText, error && styles.helperTextError]}
        >
          {helperText}
        </Text>
      ) : typeof helperText !== "undefined" ? (
        helperText(error || false)
      ) : (
        <Fragment />
      )}
    </View>
  );
}
