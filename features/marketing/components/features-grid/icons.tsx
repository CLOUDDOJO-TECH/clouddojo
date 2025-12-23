import React, { SVGProps } from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string;
}

export function IconHand2({ size = "20px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      {...props}
    >
      <line
        x1="16"
        y1="5"
        x2="16"
        y2="11"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></line>
      <line
        x1="13"
        y1="4"
        x2="13"
        y2="12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></line>
      <line
        x1="10"
        y1="3"
        x2="10"
        y2="13"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></line>
      <line
        x1="7"
        y1="4"
        x2="7"
        y2="12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></line>
      <line
        x1="7.384"
        y1="15.082"
        x2="3.5"
        y2="10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      ></line>
      <path
        d="m7,10.5v1.5l-.793,1.43c.615,2.065,2.528,3.57,4.793,3.57,2.761,0,5-2.239,5-5v-1.5H7Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        fill="currentColor"
      ></path>
    </svg>
  );
}

export function IconBookOpen({ size = "18px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      {...props}
    >
      <path
        d="M8.99999 15.051C9.16999 15.051 9.33899 15.006 9.49399 14.917C10.137 14.546 11.226 14.07 12.635 14.072C13.534 14.073 14.302 14.269 14.905 14.507C15.553 14.762 16.249 14.267 16.249 13.57V4.48701C16.249 4.13301 16.068 3.80701 15.763 3.62701C15.126 3.25101 14.037 2.76401 12.623 2.76401C10.733 2.76401 9.42499 3.63601 8.99899 3.94601"
        fill="currentColor"
        fillOpacity="0.3"
        data-color="color-2"
        data-stroke="none"
      ></path>
      <path
        d="M8.99999 15.051C9.16999 15.051 9.33899 15.006 9.49399 14.917C10.137 14.546 11.226 14.07 12.635 14.072C13.534 14.073 14.302 14.269 14.905 14.507C15.553 14.762 16.249 14.267 16.249 13.57V4.48701C16.249 4.13301 16.068 3.80701 15.763 3.62701C15.126 3.25101 14.037 2.76401 12.623 2.76401C10.733 2.76401 9.42499 3.63601 8.99899 3.94601"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
      <path
        d="M9.00001 15.051C8.83001 15.051 8.66101 15.006 8.50601 14.917C7.86301 14.546 6.77401 14.07 5.36501 14.072C4.46601 14.073 3.69801 14.269 3.09501 14.507C2.44701 14.762 1.75101 14.27 1.75101 13.574C1.75101 10.981 1.75101 6.10201 1.75101 4.48401C1.75101 4.13001 1.93201 3.80801 2.23701 3.62801C2.87401 3.25201 3.96301 2.76501 5.37701 2.76501C7.26701 2.76501 8.57501 3.63701 9.00101 3.94701V15.051H9.00001Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
    </svg>
  );
}

export function IconChatBot({ size = "20px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      {...props}
    >
      <line
        x1="7"
        y1="4"
        x2="7"
        y2="7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></line>
      <circle
        cx="7"
        cy="3"
        r="1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></circle>
      <path
        d="m13.475,7.439l-1.414-1.414c-.122-.123-.3-.172-.468-.133-.169.04-.305.164-.359.329l-.707,2.121c-.06.18-.013.378.121.512.095.095.223.146.354.146.053,0,.106-.008.158-.026l2.121-.707c.165-.055.289-.19.329-.359.04-.168-.011-.346-.133-.468Z"
        fill="currentColor"
        strokeWidth="0"
        data-color="color-2"
      ></path>
      <path
        d="m8.328,7.028c-.003-.009-.504-.019-.507-.028h-1.822c-1.657,0-3,1.343-3,3v4c0,1.657,1.343,3,3,3h8c1.657,0,3-1.343,3-3v-3.24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
      <circle
        cx="14.5"
        cy="5"
        r="3"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        data-color="color-2"
      ></circle>
      <circle
        cx="7"
        cy="11.5"
        r="1"
        strokeWidth="0"
        fill="currentColor"
      ></circle>
      <circle
        cx="13"
        cy="11.5"
        r="1"
        strokeWidth="0"
        fill="currentColor"
      ></circle>
      <path
        d="m9,13h2c.276,0,.5.224.5.5h0c0,.828-.672,1.5-1.5,1.5h0c-.828,0-1.5-.672-1.5-1.5h0c0-.276.224-.5.5-.5Z"
        strokeWidth="0"
        fill="currentColor"
      ></path>
    </svg>
  );
}

export function IconProgressBar({ size = "20px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      {...props}
    >
      <polygon
        points="12.5 3 10 6 7.5 3 12.5 3"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        data-color="color-2"
      ></polygon>
      <path
        d="m15,9H5c-2.206,0-4,1.794-4,4s1.794,4,4,4h10c2.206,0,4-1.794,4-4s-1.794-4-4-4Zm-5,5h-5c-.552,0-1-.448-1-1s.448-1,1-1h5c.552,0,1,.448,1,1s-.448,1-1,1Z"
        strokeWidth="0"
        fill="currentColor"
      ></path>
    </svg>
  );
}

export function IconPage({ size = "20px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      {...props}
    >
      <rect
        x="4"
        y="3"
        width="12"
        height="14"
        rx="3"
        ry="3"
        transform="translate(20 20) rotate(180)"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></rect>
      <rect
        x="7"
        y="6"
        width="2"
        height="2"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        data-color="color-2"
      ></rect>
      <path
        d="m13.25,9h-1.5c-.4141,0-.75-.3359-.75-.75s.3359-.75.75-.75h1.5c.4141,0,.75.3359.75.75s-.3359.75-.75.75Z"
        fill="currentColor"
        strokeWidth="0"
        data-color="color-2"
      ></path>
      <path
        d="m13.25,11.5h-6.5c-.4141,0-.75-.3359-.75-.75s.3359-.75.75-.75h6.5c.4141,0,.75.3359.75.75s-.3359.75-.75.75Z"
        fill="currentColor"
        strokeWidth="0"
        data-color="color-2"
      ></path>
      <path
        d="m11.25,14h-4.5c-.4141,0-.75-.3359-.75-.75s.3359-.75.75-.75h4.5c.4141,0,.75.3359.75.75s-.3359.75-.75.75Z"
        fill="currentColor"
        strokeWidth="0"
        data-color="color-2"
      ></path>
    </svg>
  );
}

export function IconForklift({ size = "20px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        d="m12,9H4c-1.103,0-2,.897-2,2v3c0,.552.447,1,1,1h.277c-.172-.295-.277-.634-.277-1,0-1.105.895-2,2-2s2,.895,2,2c0,.366-.106.705-.277,1h1.555c-.172-.295-.277-.634-.277-1,0-1.105.895-2,2-2s2,.895,2,2c0,.366-.106.705-.277,1h.277c.553,0,1-.448,1-1v-4c0-.552-.447-1-1-1Z"
        strokeWidth="0"
        fill="currentColor"
      ></path>
      <path
        d="m17,16h-1c-.552,0-1-.448-1-1V3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        data-color="color-2"
      ></path>
      <polygon
        points="12 10 6 10 6 4 10 4 12 10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></polygon>
      <circle
        cx="5"
        cy="14"
        r="2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></circle>
      <circle
        cx="10"
        cy="14"
        r="2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></circle>
    </svg>
  );
}

export function IconGrid2({ size = "20px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      {...props}
    >
      <rect
        x="3"
        y="3"
        width="5"
        height="5"
        rx="1.5"
        ry="1.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></rect>
      <rect
        x="12"
        y="3"
        width="5"
        height="5"
        rx="1.5"
        ry="1.5"
        transform="translate(8.136 -8.642) rotate(45)"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        data-color="color-2"
      ></rect>
      <rect
        x="3"
        y="12"
        width="5"
        height="5"
        rx="1.5"
        ry="1.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></rect>
      <rect
        x="12"
        y="12"
        width="5"
        height="5"
        rx="1.5"
        ry="1.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></rect>
    </svg>
  );
}

export function IconHexagonCheck({ size = "20px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        d="m16.083,5.056l-4.688-2.858c-.861-.523-1.93-.524-2.791,0l-4.688,2.857c-.874.533-1.417,1.531-1.417,2.604v4.679c0,1.074.543,2.072,1.417,2.604l4.688,2.858c.43.262.913.393,1.395.393s.965-.131,1.395-.393l4.688-2.857c.874-.533,1.417-1.531,1.417-2.604v-4.679c0-1.074-.543-2.072-1.417-2.604Zm-1.799,2.564l-4.75,6c-.183.231-.458.37-.753.379-.01,0-.021,0-.031,0-.283,0-.554-.12-.743-.331l-2.25-2.5c-.369-.411-.336-1.043.074-1.412.411-.37,1.042-.336,1.412.074l1.458,1.62,4.015-5.071c.343-.432.971-.506,1.405-.164.433.343.506.972.163,1.405Z"
        strokeWidth="0"
        fill="currentColor"
      ></path>
    </svg>
  );
}

export function IconUsers({ size = "20px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      {...props}
    >
      <circle
        cx="6.5"
        cy="8.5"
        r="2.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></circle>
      <circle
        cx="13.5"
        cy="5.5"
        r="2.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        data-color="color-2"
      ></circle>
      <path
        d="m10.875,11.845c.739-.532,1.645-.845,2.625-.845,1.959,0,3.626,1.252,4.244,3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        data-color="color-2"
      ></path>
      <path
        d="m2.256,17c.618-1.748,2.285-3,4.244-3s3.626,1.252,4.244,3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
    </svg>
  );
}

// companion
export function IconPenSparkleOutlineDuo18({
  strokeWidth = 1.5,
  size = "18px",
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      {...props}
    >
      <path
        d="M2.75 15.25C2.75 15.25 6.349 14.682 7.296 13.735C8.243 12.788 14.623 6.408 14.623 6.408C15.46 5.571 15.46 4.214 14.623 3.378C13.786 2.541 12.429 2.541 11.593 3.378C11.593 3.378 5.213 9.758 4.266 10.705C3.319 11.652 2.751 15.251 2.751 15.251L2.75 15.25Z"
        fill="currentColor"
        fillOpacity="0.3"
        data-color="color-2"
        data-stroke="none"
      ></path>{" "}
      <path
        d="M2.75 15.25C2.75 15.25 6.349 14.682 7.296 13.735C8.243 12.788 14.623 6.408 14.623 6.408C15.46 5.571 15.46 4.214 14.623 3.378C13.786 2.541 12.429 2.541 11.593 3.378C11.593 3.378 5.213 9.758 4.266 10.705C3.319 11.652 2.751 15.251 2.751 15.251L2.75 15.25Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>{" "}
      <path
        d="M5.49301 3.492L4.54701 3.177L4.23101 2.23C4.12901 1.924 3.62201 1.924 3.52001 2.23L3.20401 3.177L2.25801 3.492C2.10501 3.543 2.00101 3.686 2.00101 3.848C2.00101 4.01 2.10501 4.153 2.25801 4.204L3.20401 4.519L3.52001 5.466C3.57101 5.619 3.71401 5.722 3.87501 5.722C4.03601 5.722 4.18001 5.618 4.23001 5.466L4.54601 4.519L5.49201 4.204C5.64501 4.153 5.74901 4.01 5.74901 3.848C5.74901 3.686 5.64601 3.543 5.49301 3.492Z"
        fill="currentColor"
        data-stroke="none"
      ></path>{" "}
      <path
        d="M16.658 12.99L15.395 12.569L14.974 11.306C14.837 10.898 14.162 10.898 14.025 11.306L13.604 12.569L12.341 12.99C12.137 13.058 11.999 13.249 11.999 13.464C11.999 13.679 12.137 13.87 12.341 13.938L13.604 14.359L14.025 15.622C14.093 15.826 14.285 15.964 14.5 15.964C14.715 15.964 14.906 15.826 14.975 15.622L15.396 14.359L16.659 13.938C16.863 13.87 17.001 13.679 17.001 13.464C17.001 13.249 16.862 13.058 16.658 12.99Z"
        fill="currentColor"
        data-stroke="none"
      ></path>{" "}
      <path
        d="M7.75 2.5C8.16421 2.5 8.5 2.16421 8.5 1.75C8.5 1.33579 8.16421 1 7.75 1C7.33579 1 7 1.33579 7 1.75C7 2.16421 7.33579 2.5 7.75 2.5Z"
        fill="currentColor"
        data-stroke="none"
      ></path>
    </svg>
  );
}

// personalize
export function IconSideProfileHeart({ size = "20px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        d="m17.781,10.875l-1.802-2.253c-.106-1.974-1.021-3.801-2.567-5.058-1.645-1.336-3.798-1.848-5.911-1.408-2.672.558-4.825,2.734-5.358,5.414-.645,3.236.96,6.383,3.857,7.749v1.68c0,.552.447,1,1,1h4c.553,0,1-.448,1-1v-1h1c1.654,0,3-1.346,3-3v-.219l1.242-.311c.331-.083.597-.328.705-.65.109-.323.046-.679-.166-.944Zm-8.347-.03c-.258.198-.612.206-.877.018-.897-.636-2.468-2.033-2.543-3.687,0-.907.726-1.632,1.633-1.632.544,0,1.088.272,1.36.726.356-.445.8-.716,1.332-.725.854-.015,1.541.546,1.647,1.394.199,1.598-1.681,3.24-2.551,3.907Z"
        strokeWidth="0"
        fill="currentColor"
      ></path>
    </svg>
  );
}

// performance
export function IconFaceExpression({ size = "20px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      {...props}
    >
      <circle
        cx="6.75"
        cy="9.25"
        r="1.25"
        fill="currentColor"
        strokeWidth="0"
        data-color="color-2"
      ></circle>
      <circle
        cx="13.25"
        cy="9.25"
        r="1.25"
        fill="currentColor"
        strokeWidth="0"
        data-color="color-2"
      ></circle>
      <path
        d="m8.667,11.333h2.667c.368,0,.667.299.667.667h0c0,1.104-.896,2-2,2h0c-1.104,0-2-.896-2-2h0c0-.368.299-.667.667-.667Z"
        fill="currentColor"
        strokeWidth="0"
        data-color="color-2"
      ></path>
      <path
        d="m3,7v-1c0-1.657,1.343-3,3-3h1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
      <path
        d="m7,17h-1c-1.657,0-3-1.343-3-3v-1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
      <path
        d="m17,13v1c0,1.657-1.343,3-3,3h-1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
      <path
        d="m13,3h1c1.657,0,3,1.343,3,3v1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
    </svg>
  );
}

// adaptive
export function IconSlider({ size = "20px", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      {...props}
    >
      <line
        x1="3"
        y1="6"
        x2="10"
        y2="6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></line>
      <circle
        cx="12.5"
        cy="6"
        r="2.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></circle>
      <line
        x1="15"
        y1="6"
        x2="17"
        y2="6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></line>
      <line
        x1="17"
        y1="14"
        x2="10"
        y2="14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        data-color="color-2"
      ></line>
      <circle
        cx="7.5"
        cy="14"
        r="2.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        data-color="color-2"
      ></circle>
      <line
        x1="5"
        y1="14"
        x2="3"
        y2="14"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        data-color="color-2"
      ></line>
    </svg>
  );
}
