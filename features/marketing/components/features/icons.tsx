import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  strokeWidth?: number;
}

export function IconRoadmapFillDuo18({ size = "18px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      {...props}
    >
      <path
        d="M10.25 12H4.04386C3.44866 12 2.89937 11.7012 2.57507 11.2012L0.119967 7.4073C-0.040233 7.1597 -0.040233 6.8404 0.119967 6.5928L2.57406 2.7998C2.89726 2.2993 3.44667 2 4.04377 2H10.2499C11.7665 2 12.9999 3.2334 12.9999 4.75V9.25C12.9999 10.7666 11.7666 12 10.25 12Z"
        fill="currentColor"
        fillOpacity="0.4"
      ></path>
      <path
        d="M5 12H10.25C11.7666 12 12.9999 10.7666 12.9999 9.25V6H13.9561C14.5533 6 15.1026 6.2993 15.4258 6.7998L17.8799 10.5928C18.0401 10.8404 18.0401 11.1597 17.8799 11.4073L15.4248 15.2012C15.1006 15.7012 14.5513 16 13.956 16H7.7499C6.2333 16 5 14.7666 5 13.25V12Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

export function IconEyeClosedOutlineDuo18({
  strokeWidth = 1.5,
  size = "18px",
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      {...props}
    >
      <path
        d="M1.85901 7.27C3.67401 9.121 6.20301 10.27 9.00001 10.27C11.797 10.27 14.326 9.122 16.141 7.27"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
      <path
        d="M4.021 8.942L2.75 11.019"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
      <path
        d="M7.3 10.126L6.823 12.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
      <path
        d="M13.979 8.942L15.25 11.019"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
      <path
        d="M10.7 10.126L11.177 12.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
    </svg>
  );
}

export function IconPrinter({ size = "24px", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" className="nc-icon-wrapper">
        <path
          d="M5.25 9C5.94036 9 6.5 9.55964 6.5 10.25C6.5 10.9404 5.94036 11.5 5.25 11.5C4.55964 11.5 4 10.9404 4 10.25C4 9.55964 4.55964 9 5.25 9ZM14 2C14.93 2 15.3949 2.00032 15.7764 2.10254C16.8116 2.37994 17.6201 3.18836 17.8975 4.22363C17.9997 4.60513 18 5.07003 18 6C18 6.92997 17.9997 7.39487 17.8975 7.77637C17.6201 8.81164 16.8116 9.62006 15.7764 9.89746C15.3949 9.99968 14.93 10 14 10H10C9.07003 10 8.60513 9.99968 8.22363 9.89746C7.18836 9.62006 6.37994 8.81164 6.10254 7.77637C6.00032 7.39487 6 6.92997 6 6C6 5.07003 6.00032 4.60513 6.10254 4.22363C6.37994 3.18836 7.18836 2.37994 8.22363 2.10254C8.60513 2.00032 9.07003 2 10 2H14Z"
          fill="url(#bktpfo0k54-1752500502799-1238727_printer_existing_0_uy5flbj6n)"
          data-glass="origin"
          mask="url(#bktpfo0k54-1752500502799-1238727_printer_mask_oaxozr0pz)"
        ></path>
        <path
          d="M5.25 9C5.94036 9 6.5 9.55964 6.5 10.25C6.5 10.9404 5.94036 11.5 5.25 11.5C4.55964 11.5 4 10.9404 4 10.25C4 9.55964 4.55964 9 5.25 9ZM14 2C14.93 2 15.3949 2.00032 15.7764 2.10254C16.8116 2.37994 17.6201 3.18836 17.8975 4.22363C17.9997 4.60513 18 5.07003 18 6C18 6.92997 17.9997 7.39487 17.8975 7.77637C17.6201 8.81164 16.8116 9.62006 15.7764 9.89746C15.3949 9.99968 14.93 10 14 10H10C9.07003 10 8.60513 9.99968 8.22363 9.89746C7.18836 9.62006 6.37994 8.81164 6.10254 7.77637C6.00032 7.39487 6 6.92997 6 6C6 5.07003 6.00032 4.60513 6.10254 4.22363C6.37994 3.18836 7.18836 2.37994 8.22363 2.10254C8.60513 2.00032 9.07003 2 10 2H14Z"
          fill="url(#bktpfo0k54-1752500502799-1238727_printer_existing_0_uy5flbj6n)"
          data-glass="clone"
          filter="url(#bktpfo0k54-1752500502799-1238727_printer_filter_nzu6mrg3x)"
          clipPath="url(#bktpfo0k54-1752500502799-1238727_printer_clipPath_ckdid51hg)"
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.5996 6C18.8398 6 19.9608 5.99957 20.8164 6.43555C21.5689 6.81902 22.181 7.43109 22.5645 8.18359C23.0004 9.03924 23 10.1602 23 12.4004V12.5996C23 14.8398 23.0004 15.9608 22.5645 16.8164C22.181 17.5689 21.5689 18.181 20.8164 18.5645C19.9608 19.0004 18.8398 19 16.5996 19H7.40039C5.16018 19 4.03924 19.0004 3.18359 18.5645C2.43109 18.181 1.81902 17.5689 1.43555 16.8164C0.999573 15.9608 1 14.8398 1 12.5996V12.4004C1 10.1602 0.999573 9.03924 1.43555 8.18359C1.81902 7.43109 2.43109 6.81902 3.18359 6.43555C4.03924 5.99957 5.16018 6 7.40039 6H16.5996ZM5.25 9C4.55964 9 4 9.55964 4 10.25C4 10.9404 4.55964 11.5 5.25 11.5C5.94036 11.5 6.5 10.9404 6.5 10.25C6.5 9.55964 5.94036 9 5.25 9Z"
          fill="url(#bktpfo0k54-1752500502799-1238727_printer_existing_1_q0qtxeoqu)"
          data-glass="blur"
        ></path>
        <path
          d="M16.5996 6C18.8398 6 19.9608 5.99957 20.8164 6.43555C21.5689 6.81902 22.181 7.43109 22.5645 8.18359C23.0004 9.03924 23 10.1602 23 12.4004V12.5996C23 14.8398 23.0004 15.9608 22.5645 16.8164C22.181 17.5689 21.5689 18.181 20.8164 18.5645C19.9608 19.0004 18.8398 19 16.5996 19H7.40039C5.16018 19 4.03924 19.0004 3.18359 18.5645C2.43109 18.181 1.81902 17.5689 1.43555 16.8164C0.999573 15.9608 1 14.8398 1 12.5996V12.4004C1 10.1602 0.999573 9.03924 1.43555 8.18359C1.81902 7.43109 2.43109 6.81902 3.18359 6.43555C4.03924 5.99957 5.16018 6 7.40039 6H16.5996ZM7.40039 6.75C6.268 6.75 5.4636 6.75045 4.83398 6.80176C4.2133 6.85235 3.8287 6.94856 3.52441 7.10352C2.913 7.41508 2.41508 7.913 2.10352 8.52441C1.94856 8.8287 1.85235 9.2133 1.80176 9.83398C1.75045 10.4636 1.75 11.268 1.75 12.4004V12.5996C1.75 13.732 1.75045 14.5364 1.80176 15.166C1.85235 15.7867 1.94856 16.1713 2.10352 16.4756C2.41508 17.087 2.913 17.5849 3.52441 17.8965C3.8287 18.0514 4.2133 18.1476 4.83398 18.1982C5.4636 18.2495 6.268 18.25 7.40039 18.25H16.5996C17.732 18.25 18.5364 18.2495 19.166 18.1982C19.7867 18.1476 20.1713 18.0514 20.4756 17.8965C21.087 17.5849 21.5849 17.087 21.8965 16.4756C22.0514 16.1713 22.1476 15.7867 22.1982 15.166C22.2239 14.8512 22.2366 14.4927 22.2432 14.0713L22.25 12.5996V12.4004L22.2432 10.9287C22.2366 10.5073 22.2239 10.1488 22.1982 9.83398C22.1476 9.2133 22.0514 8.8287 21.8965 8.52441C21.5849 7.913 21.087 7.41508 20.4756 7.10352C20.1713 6.94856 19.7867 6.85235 19.166 6.80176C18.8512 6.7761 18.4927 6.76337 18.0713 6.75684L16.5996 6.75H7.40039Z"
          fill="url(#bktpfo0k54-1752500502799-1238727_printer_existing_2_eg7bzzemw)"
        ></path>
        <path
          d="M13.656 12C15.1906 12 15.9579 12 16.5664 12.2875C17.1023 12.5406 17.5513 12.9469 17.8565 13.455C18.2031 14.0319 18.2794 14.7954 18.4321 16.3224L18.5601 17.602C18.7125 19.126 18.7887 19.8879 18.5387 20.4769C18.319 20.9943 17.9314 21.4226 17.4385 21.6926C16.8773 22 16.1115 22 14.58 22H9.41986C7.88829 22 7.1225 22 6.56131 21.6926C6.06837 21.4226 5.68079 20.9943 5.46116 20.4769C5.21111 19.8879 5.28731 19.126 5.43971 17.602L5.56767 16.3224C5.72037 14.7954 5.79672 14.0319 6.1433 13.455C6.44855 12.9469 6.89748 12.5406 7.43342 12.2875C8.0419 12 8.80922 12 10.3438 12L13.656 12Z"
          fill="url(#bktpfo0k54-1752500502799-1238727_printer_existing_3_dku1hqiox)"
        ></path>
        <defs>
          <linearGradient
            id="bktpfo0k54-1752500502799-1238727_printer_existing_0_uy5flbj6n"
            x1="11"
            y1="0"
            x2="11"
            y2="9.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              stopColor="var(--nc-gradient-1-color-1,#575757)"
              data-glass-11="on"
            ></stop>
            <stop
              offset="1"
              stopColor="var(--nc-gradient-1-color-2,#151515)"
              data-glass-12="on"
            ></stop>
          </linearGradient>
          <linearGradient
            id="bktpfo0k54-1752500502799-1238727_printer_existing_1_q0qtxeoqu"
            x1="12"
            y1="6"
            x2="12"
            y2="19"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              stopColor="var(--nc-gradient-2-color-1,#E3E3E599)"
              data-glass-21="on"
            ></stop>
            <stop
              offset="1"
              stopColor="var(--nc-gradient-2-color-2,#BBBBC099)"
              data-glass-22="on"
            ></stop>
          </linearGradient>
          <linearGradient
            id="bktpfo0k54-1752500502799-1238727_printer_existing_2_eg7bzzemw"
            x1="12"
            y1="6"
            x2="12"
            y2="13.528"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--nc-light,#fff)" data-glass-light="on"></stop>
            <stop
              offset="1"
              stopColor="var(--nc-light,#fff)"
              stopOpacity="0"
              data-glass-light="on"
            ></stop>
          </linearGradient>
          <linearGradient
            id="bktpfo0k54-1752500502799-1238727_printer_existing_3_dku1hqiox"
            x1="12"
            y1="12"
            x2="12"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              stopColor="var(--nc-gradient-1-color-1,#575757)"
              data-glass-11="on"
            ></stop>
            <stop
              offset="1"
              stopColor="var(--nc-gradient-1-color-2,#151515)"
              data-glass-12="on"
            ></stop>
          </linearGradient>
          <filter
            id="bktpfo0k54-1752500502799-1238727_printer_filter_nzu6mrg3x"
            x="-100%"
            y="-100%"
            width="400%"
            height="400%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
          >
            <feGaussianBlur
              stdDeviation="2"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              in="SourceGraphic"
              edgeMode="none"
              result="blur"
            ></feGaussianBlur>
          </filter>
          <clipPath id="bktpfo0k54-1752500502799-1238727_printer_clipPath_ckdid51hg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.5996 6C18.8398 6 19.9608 5.99957 20.8164 6.43555C21.5689 6.81902 22.181 7.43109 22.5645 8.18359C23.0004 9.03924 23 10.1602 23 12.4004V12.5996C23 14.8398 23.0004 15.9608 22.5645 16.8164C22.181 17.5689 21.5689 18.181 20.8164 18.5645C19.9608 19.0004 18.8398 19 16.5996 19H7.40039C5.16018 19 4.03924 19.0004 3.18359 18.5645C2.43109 18.181 1.81902 17.5689 1.43555 16.8164C0.999573 15.9608 1 14.8398 1 12.5996V12.4004C1 10.1602 0.999573 9.03924 1.43555 8.18359C1.81902 7.43109 2.43109 6.81902 3.18359 6.43555C4.03924 5.99957 5.16018 6 7.40039 6H16.5996ZM5.25 9C4.55964 9 4 9.55964 4 10.25C4 10.9404 4.55964 11.5 5.25 11.5C5.94036 11.5 6.5 10.9404 6.5 10.25C6.5 9.55964 5.94036 9 5.25 9Z"
              fill="url(#bktpfo0k54-1752500502799-1238727_printer_existing_1_q0qtxeoqu)"
            ></path>
          </clipPath>
          <mask id="bktpfo0k54-1752500502799-1238727_printer_mask_oaxozr0pz">
            <rect width="100%" height="100%" fill="#FFF"></rect>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.5996 6C18.8398 6 19.9608 5.99957 20.8164 6.43555C21.5689 6.81902 22.181 7.43109 22.5645 8.18359C23.0004 9.03924 23 10.1602 23 12.4004V12.5996C23 14.8398 23.0004 15.9608 22.5645 16.8164C22.181 17.5689 21.5689 18.181 20.8164 18.5645C19.9608 19.0004 18.8398 19 16.5996 19H7.40039C5.16018 19 4.03924 19.0004 3.18359 18.5645C2.43109 18.181 1.81902 17.5689 1.43555 16.8164C0.999573 15.9608 1 14.8398 1 12.5996V12.4004C1 10.1602 0.999573 9.03924 1.43555 8.18359C1.81902 7.43109 2.43109 6.81902 3.18359 6.43555C4.03924 5.99957 5.16018 6 7.40039 6H16.5996ZM5.25 9C4.55964 9 4 9.55964 4 10.25C4 10.9404 4.55964 11.5 5.25 11.5C5.94036 11.5 6.5 10.9404 6.5 10.25C6.5 9.55964 5.94036 9 5.25 9Z"
              fill="#000"
            ></path>
          </mask>
        </defs>
      </g>
    </svg>
  );
}

export function IconMagnifier({ size = "24px", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" className="nc-icon-wrapper">
        <path
          d="M10.586 10.5859C11.3671 9.80486 12.6331 9.80486 13.4142 10.5859L21.9142 19.0859L22.0519 19.2373C22.6926 20.0228 22.6464 21.1818 21.9142 21.914C21.1819 22.6463 20.0229 22.6925 19.2374 22.0517L19.086 21.914L10.586 13.414C9.80498 12.633 9.80498 11.367 10.586 10.5859Z"
          fill="url(#0m5zczbsn76c-1752500502796-6054278_magnifier_existing_0_gpzbpr1b3)"
          data-glass="origin"
          mask="url(#0m5zczbsn76c-1752500502796-6054278_magnifier_mask_u1j50qeck)"
        ></path>
        <path
          d="M10.586 10.5859C11.3671 9.80486 12.6331 9.80486 13.4142 10.5859L21.9142 19.0859L22.0519 19.2373C22.6926 20.0228 22.6464 21.1818 21.9142 21.914C21.1819 22.6463 20.0229 22.6925 19.2374 22.0517L19.086 21.914L10.586 13.414C9.80498 12.633 9.80498 11.367 10.586 10.5859Z"
          fill="url(#0m5zczbsn76c-1752500502796-6054278_magnifier_existing_0_gpzbpr1b3)"
          data-glass="clone"
          filter="url(#0m5zczbsn76c-1752500502796-6054278_magnifier_filter_u6qjvmab1)"
          clipPath="url(#0m5zczbsn76c-1752500502796-6054278_magnifier_clipPath_k96ejzfu8)"
        ></path>
        <path
          d="M18.5 10C18.5 14.6943 14.6943 18.5 10 18.5C5.30567 18.5 1.5 14.6943 1.5 10C1.5 5.30567 5.30567 1.5 10 1.5C14.6943 1.5 18.5 5.30567 18.5 10Z"
          fill="url(#0m5zczbsn76c-1752500502796-6054278_magnifier_existing_1_82nwa6xrf)"
          data-glass="blur"
        ></path>
        <path
          d="M17.75 10C17.75 5.71989 14.2801 2.25 10 2.25C5.71989 2.25 2.25 5.71989 2.25 10C2.25 14.2801 5.71989 17.75 10 17.75V18.5C5.30567 18.5 1.5 14.6943 1.5 10C1.5 5.30567 5.30567 1.5 10 1.5C14.6943 1.5 18.5 5.30567 18.5 10C18.5 14.6943 14.6943 18.5 10 18.5V17.75C14.2801 17.75 17.75 14.2801 17.75 10Z"
          fill="url(#0m5zczbsn76c-1752500502796-6054278_magnifier_existing_2_8ve8k2etb)"
        ></path>
        <defs>
          <linearGradient
            id="0m5zczbsn76c-1752500502796-6054278_magnifier_existing_0_gpzbpr1b3"
            x1="16.25"
            y1="10"
            x2="16.25"
            y2="22.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              stopColor="var(--nc-gradient-1-color-1,#575757)"
              data-glass-11="on"
            ></stop>
            <stop
              offset="1"
              stopColor="var(--nc-gradient-1-color-2,#151515)"
              data-glass-12="on"
            ></stop>
          </linearGradient>
          <linearGradient
            id="0m5zczbsn76c-1752500502796-6054278_magnifier_existing_1_82nwa6xrf"
            x1="10"
            y1="1.5"
            x2="10"
            y2="18.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              stopColor="var(--nc-gradient-2-color-1,#E3E3E599)"
              data-glass-21="on"
            ></stop>
            <stop
              offset="1"
              stopColor="var(--nc-gradient-2-color-2,#BBBBC099)"
              data-glass-22="on"
            ></stop>
          </linearGradient>
          <linearGradient
            id="0m5zczbsn76c-1752500502796-6054278_magnifier_existing_2_8ve8k2etb"
            x1="10"
            y1="1.5"
            x2="10"
            y2="11.345"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--nc-light,#fff)" data-glass-light="on"></stop>
            <stop
              offset="1"
              stopColor="var(--nc-light,#fff)"
              stopOpacity="0"
              data-glass-light="on"
            ></stop>
          </linearGradient>
          <filter
            id="0m5zczbsn76c-1752500502796-6054278_magnifier_filter_u6qjvmab1"
            x="-100%"
            y="-100%"
            width="400%"
            height="400%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
          >
            <feGaussianBlur
              stdDeviation="2"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              in="SourceGraphic"
              edgeMode="none"
              result="blur"
            ></feGaussianBlur>
          </filter>
          <clipPath id="0m5zczbsn76c-1752500502796-6054278_magnifier_clipPath_k96ejzfu8">
            <path
              d="M18.5 10C18.5 14.6943 14.6943 18.5 10 18.5C5.30567 18.5 1.5 14.6943 1.5 10C1.5 5.30567 5.30567 1.5 10 1.5C14.6943 1.5 18.5 5.30567 18.5 10Z"
              fill="url(#0m5zczbsn76c-1752500502796-6054278_magnifier_existing_1_82nwa6xrf)"
            ></path>
          </clipPath>
          <mask id="0m5zczbsn76c-1752500502796-6054278_magnifier_mask_u1j50qeck">
            <rect width="100%" height="100%" fill="#FFF"></rect>
            <path
              d="M18.5 10C18.5 14.6943 14.6943 18.5 10 18.5C5.30567 18.5 1.5 14.6943 1.5 10C1.5 5.30567 5.30567 1.5 10 1.5C14.6943 1.5 18.5 5.30567 18.5 10Z"
              fill="#000"
            ></path>
          </mask>
        </defs>
      </g>
    </svg>
  );
}
