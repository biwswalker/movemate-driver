import { MMKV } from "react-native-mmkv";

// สร้าง instance ของ MMKV ไว้ใช้งานร่วมกัน
export const storage = new MMKV();

/**
 * สร้าง Object ที่มีหน้าตา (Interface) เหมือน AsyncStorage
 * แต่ข้างในทำงานด้วย MMKV แบบ Synchronous
 * โดยเราจะ return Promise.resolve() เพื่อทำให้มันดูเหมือนเป็น Asynchronous
 * ในสายตาของ apollo3-cache-persist
 */
export const mmkvStorageAdapter = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve(true);
  },
};
