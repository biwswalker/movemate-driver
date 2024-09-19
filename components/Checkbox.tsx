import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Text from './Text';
import colors from '@/constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colors.action.active,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.main,
  },
  textStyle: {
    flex: 1,
  },
});

interface CheckboxProps {
  label: string | ReactNode;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function Checkbox({ label, value, onChange }: CheckboxProps) {
  function handlePress() {
    onChange(!value);
  }

  const checkboxSVG = `<svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"/></svg>`;

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={[styles.checkbox, value && styles.checked]}>
        {value && <SvgXml xml={checkboxSVG} />}
      </View>
      {typeof label === 'string' ? (
        <Text style={styles.textStyle} varient="body2">
          {label}
        </Text>
      ) : (
        label
      )}
    </TouchableOpacity>
  );
}
