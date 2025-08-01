import Colors from '@constants/colors';
import { normalize } from '@utils/normalizeSize';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.common.white,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: normalize(80),
    resizeMode: 'contain',
  },
});

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('@assets/images/MovemateLogo.png')} style={styles.image} />
    </View>
  );
}
