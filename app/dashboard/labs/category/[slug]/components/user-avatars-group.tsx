"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarsGroupProps {
  /**
   * Total count of users who completed the project
   */
  count: number;
  /**
   * Maximum number of avatars to display before showing +X
   * @default 4
   */
  maxDisplay?: number;
  /**
   * Array of user objects with image URLs and names
   * If not provided, will use placeholder avatars
   */
  users?: Array<{
    id: string;
    imageUrl?: string | null;
    name: string;
  }>;
}

const BeTheFirstIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="18px"
    height="18px"
    viewBox="0 0 18 18"
  >
    <path
      d="M11.251 11.758C10.779 12.504 9.94698 13 9.00098 13C8.05498 13 7.22298 12.504 6.75098 11.758"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M6.00098 10C6.55298 10 7.00098 9.5523 7.00098 9C7.00098 8.4477 6.55298 8 6.00098 8C5.44898 8 5.00098 8.4477 5.00098 9C5.00098 9.5523 5.44898 10 6.00098 10Z"
      fill="currentColor"
    />
    <path
      d="M12.001 10C12.553 10 13.001 9.5523 13.001 9C13.001 8.4477 12.553 8 12.001 8C11.449 8 11.001 8.4477 11.001 9C11.001 9.5523 11.449 10 12.001 10Z"
      fill="currentColor"
    />
    <path
      d="M14.751 1.25V6.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M17.251 3.75H12.251"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M9.95866 1.8155C9.64536 1.7729 9.32598 1.75 9.00098 1.75C4.99698 1.75 1.75098 4.996 1.75098 9C1.75098 13.004 4.99698 16.25 9.00098 16.25C13.005 16.25 16.251 13.004 16.251 9C16.251 8.9496 16.2505 8.8992 16.2494 8.849"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

/**
 * UserAvatarsGroup - Displays overlapping user avatars with a count indicator
 *
 * Shows profile photos of users in an overlapping layout with a "+X" button
 * for remaining users when count exceeds maxDisplay.
 * When count is 0, shows a "Be the first" badge.
 */
export function UserAvatarsGroup({
  count,
  maxDisplay = 4,
  users,
}: UserAvatarsGroupProps) {
  // Show "Be the first" badge if no users
  if (count === 0) {
    return (
      <Badge
        variant="outline"
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
      >
        <BeTheFirstIcon />
        <span className="text-xs">Be the first to take this project</span>
      </Badge>
    );
  }

  // Generate placeholder colors for avatars
  const avatarColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-emerald-500",
  ];

  // Calculate how many avatars to show
  const displayCount = Math.min(maxDisplay, count);
  const remainingCount = count - maxDisplay;

  return (
    <div className="flex items-center rounded-full border bg-background p-1 shadow-sm">
      <div className="flex -space-x-3">
        {Array.from({ length: displayCount }).map((_, i) => {
          const user = users?.[i];
          const fallbackLetter =
            user?.name?.charAt(0).toUpperCase() || String.fromCharCode(65 + i);

          return (
            <Avatar
              key={user?.id || i}
              className="w-10 h-10 ring-2 ring-background"
            >
              {user?.imageUrl && (
                <AvatarImage src={user.imageUrl} alt={user.name} />
              )}
              <AvatarFallback className={avatarColors[i % avatarColors.length]}>
                {fallbackLetter}
              </AvatarFallback>
            </Avatar>
          );
        })}
      </div>
      {remainingCount > 0 && (
        <Button
          variant="secondary"
          className="flex items-center justify-center rounded-full bg-transparent px-3 text-xs text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground"
          disabled
        >
          +{remainingCount}
        </Button>
      )}
    </div>
  );
}
