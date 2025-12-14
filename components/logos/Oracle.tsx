import type { SVGProps } from "react";

export const Oracle = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="#ef4444"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8.5 8a4 4 0 1 0 0 8h7a4 4 0 0 0 0-8zm-7 4a7 7 0 0 1 7-7h7a7 7 0 1 1 0 14h-7a7 7 0 0 1-7-7Z"
      clipRule="evenodd"
    ></path>
  </svg>
);

export default Oracle;
