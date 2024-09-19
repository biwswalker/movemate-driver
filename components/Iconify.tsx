// import { Icon, IconProps } from "@iconify/react";

// interface IconifyProps extends IconProps {}

// export default function Iconify(props: IconifyProps) {
//   return <Icon {...props} />;
// }

import React from "react";
import { Iconify as RNIconify } from "react-native-iconify";
import { XmlProps } from "react-native-svg";

type Props = {
  icon: string;
  size?: number;
} & Omit<XmlProps, "xml">;

export default function Iconify({ icon, size = 24, ...props }: Props) {
  return <RNIconify {...props} size={size} icon={icon} />;
}
