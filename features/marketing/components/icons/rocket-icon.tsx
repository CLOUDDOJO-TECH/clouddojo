import React, { SVGProps } from "react";

export interface RocketIconProps extends React.SVGProps<SVGSVGElement> {
  size?: string;
}

export function RocketIcon({ size, className = "", ...props }: RocketIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      viewBox="0 0 18 18"
      {...props}
    >
      <path
        d="M7.10864 10.8914L10.168 16.1366C10.738 17.1166 12.1609 16.9199 12.5045 15.8905L16.6611 2.95948C16.8168 2.47494 16.6644 1.98204 16.3454 1.65457L7.10864 10.8914Z"
        fill="currentColor"
      />
      <path
        d="M16.3454 1.65457C16.0266 1.32724 15.5414 1.16522 15.0309 1.34208L2.1175 5.493C1.05388 5.83444 0.904026 7.27119 1.86313 7.83186L7.10863 10.8914L16.3454 1.65457Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}
