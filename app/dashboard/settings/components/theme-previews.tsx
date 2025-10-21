/**
 * Theme Preview Components
 * Separated visual previews for different theme options
 */

interface ThemePreviewProps {
  className?: string;
}

/**
 * Light Theme Preview Component
 */
export function LightThemePreview({ className = "" }: ThemePreviewProps) {
  return (
    <div className={`h-full w-full p-3 space-y-1 bg-white ${className}`}>
      {/* Top bar */}
      <div className="h-2 w-full rounded-[3px] bg-gradient-to-l from-gray-300 to-gray-400" />

      {/* Content area */}
      <div className="flex gap-1">
        {/* Sidebar representation */}
        <div className="w-4 h-16 rounded-[3px] bg-gray-200" />

        {/* Main content */}
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-300 to-gray-200" />
          <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-100 to-gray-200" />
          <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-100 to-gray-200" />

          <div className="h-1 w-4 bg-emerald-500 rounded-sm justify-end items-end flex" />
        </div>
      </div>
    </div>
  );
}

/**
 * Dark Theme Preview Component
 */
export function DarkThemePreview({ className = "" }: ThemePreviewProps) {
  return (
    <div className={`h-full w-full p-3 space-y-1 bg-gray-900 ${className}`}>
      {/* Top bar */}
      <div className="h-2 w-full rounded-[3px] bg-gradient-to-l from-gray-700 to-gray-800" />

      {/* Content area */}
      <div className="flex gap-1">
        {/* Sidebar representation */}
        <div className="w-4 h-16 rounded-[3px] bg-gray-800" />

        {/* Main content */}
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-600 to-gray-700" />
          <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-600 to-gray-700" />
          <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-600 to-gray-700" />

          <div className="h-1 w-4 bg-emerald-500 rounded-sm justify-end items-end flex" />
        </div>
      </div>
    </div>
  );
}

/**
 * System Theme Preview Component
 * Shows a split view: half light, half dark
 */
export function SystemThemePreview({ className = "" }: ThemePreviewProps) {
  return (
    <div className={`h-full w-full flex ${className}`}>
      {/* Light Half */}
      <div className="w-1/2 h-full p-3 space-y-1 bg-white">
        {/* Top bar */}
        <div className="h-2 w-full rounded-l-[3px] bg-gradient-to-l from-gray-300 to-gray-400" />

        {/* Content area */}
        <div className="flex gap-1">
          {/* Sidebar representation */}
          <div className="w-4 h-16 rounded-[3px] bg-gray-200" />

          {/* Main content */}
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-300 to-gray-200" />
            <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-100 to-gray-200" />
            <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-100 to-gray-200" />

            <div className="h-1 w-4 bg-emerald-500 rounded-sm justify-end items-end flex" />
          </div>
        </div>
      </div>

      {/* Dark Half */}
      <div className="w-1/2 h-full p-3 space-y-1 bg-gray-900">
        {/* Top bar */}
        <div className="h-2 w-full rounded-r-[3px] bg-gradient-to-l from-gray-700 to-gray-800" />

        {/* Content area */}
        <div className="flex gap-1">
          {/* Sidebar representation */}
          <div className="w-4 h-16 rounded-[3px] bg-gray-800" />

          {/* Main content */}
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-600 to-gray-700" />
            <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-600 to-gray-700" />
            <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-600 to-gray-700" />

            <div className="h-1 w-4 bg-emerald-500 rounded-sm justify-end items-end flex" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generic Theme Preview Wrapper
 * Renders the appropriate theme preview based on the theme value
 */
interface ThemePreviewWrapperProps {
  theme: "light" | "dark" | "system";
  className?: string;
}

export function ThemePreviewWrapper({
  theme,
  className = "",
}: ThemePreviewWrapperProps) {
  switch (theme) {
    case "light":
      return <LightThemePreview className={className} />;
    case "dark":
      return <DarkThemePreview className={className} />;
    case "system":
      return <SystemThemePreview className={className} />;
    default:
      return <SystemThemePreview className={className} />;
  }
}
