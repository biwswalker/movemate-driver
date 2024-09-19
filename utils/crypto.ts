import CryptoES from "crypto-es";

export function encryption(encryptext: string) {
  const key = process.env.EXPO_PUBLIC_SHARED_KEY;
  const text = CryptoES.AES.encrypt(encryptext, key).toString();
  return text || "";
}

export function decryption(decryptext: string) {
  const key = process.env.EXPO_PUBLIC_SHARED_KEY;
  const text = CryptoES.AES.decrypt(decryptext, key).toString(
    CryptoES.enc.Utf8
  );
  return text || "";
}
