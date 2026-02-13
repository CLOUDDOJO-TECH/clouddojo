import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  strokeWidth?: number;
  size?: string;
}

function IconWindowChartLineOutline18({strokeWidth = 1.5, size = '18px', ...props}: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={size} height={size} viewBox="0 0 18 18" {...props}><g data-transform-wrapper="on" transform="translate(18 0) scale(-1 1)"><polyline points="4.75 12 6.5 10 7.5 11.25 9.5 7.75 11 10.25 13.25 5.75" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} data-color="color-2"></polyline><rect x="1.75" y="2.75" width="14.5" height="12.5" rx="2" ry="2" transform="translate(18 18) rotate(180)" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}></rect><circle cx="4.25" cy="5.25" r=".75" fill="currentColor"></circle><circle cx="6.75" cy="5.25" r=".75" fill="currentColor"></circle></g></svg>
  );
}

export default IconWindowChartLineOutline18;
