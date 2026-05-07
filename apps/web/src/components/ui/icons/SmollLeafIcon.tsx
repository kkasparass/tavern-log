import type { IconProps } from "./types";

export function SmollLeafIcon({
  width,
  height,
  className,
  color = "rgb(140,184,136)",
  secColor = "rgb(38,84,34)",
  ...props
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 1015 521"
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
          id="smollLeafGradient"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(577.557329,321.98758,-321.98758,577.557329,148.96,96.13)"
        >
          <stop offset="0" style={{ stopColor: color, stopOpacity: 1 }} />
          <stop offset="1" style={{ stopColor: secColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <g id="smoll-leaf">
        <path
          id="leaf-shape"
          d="M1010.18,418.773C905.04,525.574 511.562,520.786 511.562,520.786L16.904,0C16.904,0 1141.126,311.972 1010.18,418.773Z"
          style={{ fill: "url(#smollLeafGradient)" }}
        />
        <path
          id="primary-shadow"
          d="M763.47,401.91C687.585,359.751 271.623,133.908 271.623,133.908L634.185,390.681C634.185,390.681 839.355,444.081 763.47,401.91Z"
          style={{ fill: secColor }}
        />
      </g>
    </svg>
  );
}
