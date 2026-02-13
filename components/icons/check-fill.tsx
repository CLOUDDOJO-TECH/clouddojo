import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string;
}

export default function IconCheckFill12({
  size = "12px",
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      {...props}
    >
      <path
        d="m4.01,10.754c-.225.007-.458-.111-.6-.3l-2.25-3c-.249-.332-.181-.802.15-1.05.333-.248.802-.181,1.05.15l1.652,2.203L9.642,1.294c.25-.331.72-.396,1.05-.147.331.25.396.72.147,1.05l-6.23,8.258c-.142.188-.363.298-.599.298Z"
        strokeWidth="0"
        fill="currentColor"
      />
    </svg>
  );
}
