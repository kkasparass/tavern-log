import type { SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  color?: string;
  secColor?: string;
}
