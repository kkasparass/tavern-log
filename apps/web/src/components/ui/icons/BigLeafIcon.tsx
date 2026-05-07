import type { IconProps } from "./types";

export function BigLeafIcon({
  width,
  height,
  className,
  color = "rgb(142,203,137)",
  secColor = "rgb(40,59,38)",
  ...props
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 538 774"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinejoin: "round",
        strokeMiterlimit: 2,
      }}
      {...props}
    >
      <defs>
        <linearGradient
          id="bigLeafGradient"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-390.19347,334.493707,-334.493707,-390.19347,458.017,325.850)"
        >
          <stop offset="0" style={{ stopColor: color, stopOpacity: 1 }} />
          <stop offset="1" style={{ stopColor: secColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <g id="big-leaf">
        <path
          id="leaf-shape"
          d="M535.204,491.847C456.977,757.444 199.812,786.487 116.432,770.092C33.052,753.697 -48.447,471.821 34.925,393.478C236.817,203.765 299.118,0 299.118,0C299.118,0 567.528,382.103 535.204,491.847Z"
          style={{ fill: "url(#bigLeafGradient)" }}
        />
        <path
          id="primary-shadow"
          d="M180.402,730.484C180.402,730.484 308.895,591.971 329.524,516.526C350.154,441.080 317.736,90.967 317.736,90.967C317.736,90.967 282.960,426.345 248.185,488.234C213.409,550.122 180.402,730.484 180.402,730.484Z"
          style={{ fill: secColor }}
        />
      </g>
    </svg>
  );
}
