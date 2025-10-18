import { View, StyleSheet } from "react-native";
import colors from "@constants/colors"; // สมมติว่าคุณมีไฟล์สี
import { normalize } from "@/utils/normalizeSize"; // สมมติว่าคุณมีฟังก์ชันนี้

const DashDivider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 1, // ความสูงของเส้น
    borderWidth: 1, // ต้องมี borderWidth เพื่อให้ borderStyle ทำงาน
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: colors.divider, // สีของเส้นประ
    borderStyle: "dashed", // รูปแบบเส้นประ
    marginVertical: 4, // ระยะห่างบน-ล่าง
  },
});

export default DashDivider;
