import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  strokeWidth?: number;
  size?: string;
}

function IconLockOpen2OutlineDuo18({strokeWidth = 1.5, size = '18px', ...props}: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={size} height={size} viewBox="0 0 18 18" {...props}><g data-transform-wrapper="on" transform="translate(18 0) scale(-1 1)"><path d="M13.25 8.25H5.75C4.64543 8.25 3.75 9.14543 3.75 10.25V14.25C3.75 15.3546 4.64543 16.25 5.75 16.25H13.25C14.3546 16.25 15.25 15.3546 15.25 14.25V10.25C15.25 9.14543 14.3546 8.25 13.25 8.25Z" fill="currentColor" fillOpacity="0.3" data-color="color-2"></path> <path d="M7.25 8.25V5C7.25 3.205 5.795 1.75 4 1.75C2.205 1.75 0.75 3.205 0.75 5V6.25" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none"></path> <path d="M9.5 11.75V12.75" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none"></path> <path d="M13.25 8.25H5.75C4.64543 8.25 3.75 9.14543 3.75 10.25V14.25C3.75 15.3546 4.64543 16.25 5.75 16.25H13.25C14.3546 16.25 15.25 15.3546 15.25 14.25V10.25C15.25 9.14543 14.3546 8.25 13.25 8.25Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none"></path></g></svg>
  );
}

export default IconLockOpen2OutlineDuo18;
