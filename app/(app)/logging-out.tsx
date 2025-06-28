// app/(app)/logging-out.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import useAuth from '@/hooks/useAuth';

const LoggingOutScreen = () => {
  const { logout } = useAuth();

  // เมื่อเข้ามาหน้านี้ ให้เรียกฟังก์ชัน logout ทันที
  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoggingOutScreen;