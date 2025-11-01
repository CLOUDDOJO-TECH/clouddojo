"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { Info } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

// Custom SVG Icons
const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
  >
    <path
      d="M13.75 4.5H7.25C5.7334 4.5 4.5 5.7334 4.5 7.25V13.75C4.5 15.2666 5.7334 16.5 7.25 16.5H13.75C15.2666 16.5 16.5 15.2666 16.5 13.75V7.25C16.5 5.7334 15.2666 4.5 13.75 4.5ZM13.6016 8.70166L10.2051 13.2017C10.0772 13.3716 9.88281 13.4786 9.67191 13.4971C9.64941 13.4991 9.62801 13.5 9.60651 13.5C9.41701 13.5 9.23439 13.4287 9.09479 13.2988L7.48541 11.7988C7.18271 11.5161 7.1661 11.0414 7.4483 10.7386C7.7305 10.4339 8.20609 10.4198 8.50879 10.701L9.50879 11.6337L12.4043 7.79834C12.6533 7.46724 13.1221 7.40075 13.4551 7.65125C13.7852 7.90075 13.8516 8.37106 13.6016 8.70166Z"
      fill="rgba(5, 150, 105, 1)"
    />
    <path
      d="M3.5664 3.5439L10.4902 2.5146C10.998 2.4399 11.4931 2.6786 11.7529 3.1263C11.9609 3.4847 12.4218 3.60638 12.7773 3.39888C13.1357 3.19088 13.2578 2.73189 13.0498 2.37349C12.4805 1.39109 11.3896 0.863703 10.2695 1.0312L3.3466 2.0605C2.62 2.1679 1.97839 2.55212 1.54089 3.14192C1.10439 3.73222 0.922694 4.4573 1.03019 5.1844L2.0077 11.7651C2.0634 12.1372 2.3837 12.4046 2.7489 12.4046C2.786 12.4046 2.8231 12.4022 2.8602 12.3963C3.2694 12.3358 3.5526 11.954 3.492 11.5443L2.51449 4.96419C2.46469 4.63309 2.5477 4.30358 2.7469 4.03548C2.9451 3.76738 3.2364 3.5927 3.5664 3.5439Z"
      fill="rgba(5, 150, 105, 1)"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
  >
    <path
      d="M16.4364 12.5151L11.0101 3.11316C10.5902 2.39096 9.83872 1.96045 8.99982 1.96045C8.16092 1.96045 7.40952 2.39106 6.98952 3.11316C6.98902 3.11366 6.98902 3.11473 6.98852 3.11523L1.56272 12.5156C1.14332 13.2436 1.14332 14.1128 1.56372 14.8398C1.98362 15.5664 2.73562 16 3.57492 16H14.4245C15.2639 16 16.0158 15.5664 16.4357 14.8398C16.8561 14.1127 16.8563 13.2436 16.4364 12.5151ZM8.24992 6.75C8.24992 6.3359 8.58582 6 8.99992 6C9.41402 6 9.74992 6.3359 9.74992 6.75V9.75C9.74992 10.1641 9.41402 10.5 8.99992 10.5C8.58582 10.5 8.24992 10.1641 8.24992 9.75V6.75ZM8.99992 13.5C8.44792 13.5 7.99992 13.0498 7.99992 12.5C7.99992 11.9502 8.44792 11.5 8.99992 11.5C9.55192 11.5 9.99992 11.9502 9.99992 12.5C9.99992 13.0498 9.55192 13.5 8.99992 13.5Z"
      fill="rgba(220, 38, 38, 1)"
    />
  </svg>
);

const LoadingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    className="animate-spin"
  >
    <path
      d="M9,5c-.414,0-.75-.336-.75-.75V1.75c0-.414,.336-.75,.75-.75s.75,.336,.75,.75v2.5c0,.414-.336,.75-.75,.75Z"
      fill="rgba(37, 99, 235, 1)"
    />
    <path
      d="M12.359,6.391c-.192,0-.384-.073-.53-.22-.293-.293-.293-.768,0-1.061l1.768-1.768c.293-.293,.768-.293,1.061,0s.293,.768,0,1.061l-1.768,1.768c-.146,.146-.338,.22-.53,.22Z"
      opacity=".88"
      fill="rgba(37, 99, 235, 1)"
    />
    <path
      d="M16.25,9.75h-2.5c-.414,0-.75-.336-.75-.75s.336-.75,.75-.75h2.5c.414,0,.75,.336,.75,.75s-.336,.75-.75,.75Z"
      opacity=".75"
      fill="rgba(37, 99, 235, 1)"
    />
    <path
      d="M14.126,14.876c-.192,0-.384-.073-.53-.22l-1.768-1.768c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0l1.768,1.768c.293,.293,.293,.768,0,1.061-.146,.146-.338,.22-.53,.22Z"
      opacity=".63"
      fill="rgba(37, 99, 235, 1)"
    />
    <path
      d="M9,17c-.414,0-.75-.336-.75-.75v-2.5c0-.414,.336-.75,.75-.75s.75,.336,.75,.75v2.5c0,.414-.336,.75-.75,.75Z"
      opacity=".5"
      fill="rgba(37, 99, 235, 1)"
    />
    <path
      d="M3.874,14.876c-.192,0-.384-.073-.53-.22-.293-.293-.293-.768,0-1.061l1.768-1.768c.293-.293,.768-.293,1.061,0s.293,.768,0,1.061l-1.768,1.768c-.146,.146-.338,.22-.53,.22Z"
      opacity=".38"
      fill="rgba(37, 99, 235, 1)"
    />
    <path
      d="M4.25,9.75H1.75c-.414,0-.75-.336-.75-.75s.336-.75,.75-.75h2.5c.414,0,.75,.336,.75,.75s-.336,.75-.75,.75Z"
      opacity=".25"
      fill="rgba(37, 99, 235, 1)"
    />
    <path
      d="M5.641,6.391c-.192,0-.384-.073-.53-.22l-1.768-1.768c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0l1.768,1.768c.293,.293,.293,.768,0,1.061-.146,.146-.338,.22-.53,.22Z"
      opacity=".13"
      fill="rgba(37, 99, 235, 1)"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
  >
    <path
      opacity="0.4"
      d="M16.4364 12.5151L11.0101 3.11316C10.5902 2.39096 9.83872 1.96045 8.99982 1.96045C8.16092 1.96045 7.40952 2.39106 6.98952 3.11316C6.98902 3.11366 6.98902 3.11473 6.98852 3.11523L1.56272 12.5156C1.14332 13.2436 1.14332 14.1128 1.56372 14.8398C1.98362 15.5664 2.73562 16 3.57492 16H14.4245C15.2639 16 16.0158 15.5664 16.4357 14.8398C16.8561 14.1127 16.8563 13.2436 16.4364 12.5151Z"
      fill="rgba(245, 158, 11, 1)"
    />
    <path
      d="M9 10.5C8.5859 10.5 8.25 10.1641 8.25 9.75V6.75C8.25 6.3359 8.5859 6 9 6C9.4141 6 9.75 6.3359 9.75 6.75V9.75C9.75 10.1641 9.4141 10.5 9 10.5Z"
      fill="rgba(245, 158, 11, 1)"
    />
    <path
      d="M9 13.5C8.448 13.5 8 13.05 8 12.5C8 11.95 8.448 11.5 9 11.5C9.552 11.5 10 11.9501 10 12.5C10 13.0499 9.552 13.5 9 13.5Z"
      fill="rgba(245, 158, 11, 1)"
    />
  </svg>
);

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      expand={true}
      richColors
      icons={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        warning: <WarningIcon />,
        info: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
        loading: <LoadingIcon />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-lg group-[.toaster]:backdrop-blur-sm",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-2",
          success:
            "group-[.toaster]:bg-emerald-50 dark:group-[.toaster]:bg-emerald-950/30 group-[.toaster]:text-emerald-900 dark:group-[.toaster]:text-emerald-100 group-[.toaster]:border-emerald-200 dark:group-[.toaster]:border-emerald-800",
          error:
            "group-[.toaster]:bg-red-50 dark:group-[.toaster]:bg-red-950/30 group-[.toaster]:text-red-900 dark:group-[.toaster]:text-red-100 group-[.toaster]:border-red-200 dark:group-[.toaster]:border-red-800",
          warning:
            "group-[.toaster]:bg-yellow-50 dark:group-[.toaster]:bg-yellow-950/30 group-[.toaster]:text-yellow-900 dark:group-[.toaster]:text-yellow-100 group-[.toaster]:border-yellow-200 dark:group-[.toaster]:border-yellow-800",
          info: "group-[.toaster]:bg-blue-50 dark:group-[.toaster]:bg-blue-950/30 group-[.toaster]:text-blue-900 dark:group-[.toaster]:text-blue-100 group-[.toaster]:border-blue-200 dark:group-[.toaster]:border-blue-800",
          loading:
            "group-[.toaster]:bg-slate-50 dark:group-[.toaster]:bg-slate-900/30 group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-slate-100 group-[.toaster]:border-slate-200 dark:group-[.toaster]:border-slate-800",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
