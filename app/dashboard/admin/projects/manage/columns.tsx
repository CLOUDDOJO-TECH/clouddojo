"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProjectTableData } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  EyeOff,
  Globe,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";

const SortIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18px"
    height="18px"
    viewBox="0 0 18 18"
    className="ml-2"
  >
    <polyline
      points="12.5 6.25 9 2.75 5.5 6.25"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></polyline>
    <polyline
      points="12.5 11.75 9 15.25 5.5 11.75"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></polyline>
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18px"
    height="18px"
    viewBox="0 0 18 18"
    className="h-4 w-4 mr-1"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.554137 13.5756C1.34525 11.4759 3.36866 9.978 5.74997 9.978C8.13128 9.978 10.1547 11.4759 10.9458 13.5756C11.3059 14.5315 10.7272 15.5154 9.84596 15.8102C8.82613 16.1509 7.42657 16.477 5.75097 16.477C4.0754 16.477 2.67527 16.151 1.65458 15.8104C0.771586 15.5163 0.194851 14.5312 0.554137 13.5756Z"
      fill="currentColor"
    ></path>
    <path
      d="M12.5523 13.9772C13.9847 13.9159 15.1901 13.6248 16.096 13.3222C16.9772 13.0274 17.5559 12.0435 17.1958 11.0875C16.4047 8.98793 14.3813 7.48999 12 7.48999C10.5581 7.48999 9.24737 8.03921 8.26202 8.93866C10.147 9.65809 11.6398 11.1632 12.3495 13.0467C12.4675 13.3601 12.5329 13.6723 12.5523 13.9772Z"
      fill="currentColor"
      fillOpacity="0.4"
    ></path>
    <path
      d="M5.75 8.50049C6.99267 8.50049 8 7.49361 8 6.25049C8 5.00736 6.99267 4.00049 5.75 4.00049C4.50733 4.00049 3.5 5.00736 3.5 6.25049C3.5 7.49361 4.50733 8.50049 5.75 8.50049Z"
      fill="currentColor"
    ></path>
    <path
      d="M12 6.00049C13.2427 6.00049 14.25 4.99361 14.25 3.75049C14.25 2.50736 13.2427 1.50049 12 1.50049C10.7573 1.50049 9.75 2.50736 9.75 3.75049C9.75 4.99361 10.7573 6.00049 12 6.00049Z"
      fill="currentColor"
      fillOpacity="0.4"
    ></path>
  </svg>
);

const PremiumIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14px"
    height="14px"
    viewBox="0 0 18 18"
    className="mr-1"
  >
    <path
      d="M16.0096 2.3203L15 1.98173L14.6628 0.963857C14.5539 0.634958 14.0128 0.634958 13.9039 0.963857L13.5667 1.98173L12.5571 2.3203C12.3938 2.37512 12.2828 2.52882 12.2828 2.70294C12.2828 2.87706 12.3938 3.03077 12.5571 3.08558L13.5667 3.42416L13.9039 4.44202C13.9584 4.60647 14.111 4.71718 14.2828 4.71718C14.4546 4.71718 14.6083 4.6054 14.6617 4.44202L14.9989 3.42416L16.0085 3.08558C16.1718 3.03077 16.2828 2.87706 16.2828 2.70294C16.2828 2.52882 16.1729 2.37512 16.0096 2.3203Z"
      fill="currentColor"
    ></path>
    <path
      d="M1.75 3C2.16421 3 2.5 2.66421 2.5 2.25C2.5 1.83579 2.16421 1.5 1.75 1.5C1.33579 1.5 1 1.83579 1 2.25C1 2.66421 1.33579 3 1.75 3Z"
      fill="currentColor"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.41101 2.5C4.92601 2.5 4.45801 2.702 4.12601 3.054L1.72301 5.61C1.14201 6.228 1.09001 7.167 1.60001 7.844L7.59301 15.8C7.92801 16.245 8.44101 16.5 9.00001 16.5C9.55901 16.5 10.072 16.245 10.407 15.8L16.4 7.844C16.6468 7.51635 16.762 7.12709 16.7493 6.74266C16.7452 6.33196 16.4102 6 15.9985 6H12.398L10.7852 2.90354C10.656 2.65555 10.3996 2.5 10.12 2.5H5.41101ZM8.99901 13.905L10.933 7.5H7.06501L8.99901 13.905ZM5.41001 4C5.33701 4 5.26701 4.03 5.21801 4.082L3.41501 6H5.60101L6.64301 4H5.41001Z"
      fill="currentColor"
    ></path>
  </svg>
);

const difficultyColors = {
  BEGINER:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  INTERMEDIATE:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  ADVANCED:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
  EXPERT: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
};

const typeColors = {
  TUTORIAL: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  CHALLENGE:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  ASSESSMENT:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
  CAPSTONE: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
};

export const columns: ColumnDef<ProjectTableData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <SortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const isPremium = row.original.isPremium;
      return (
        <div className="max-w-[300px]">
          <p className="font-medium truncate">{title}</p>
          {isPremium && (
            <Badge
              className="bg-yellow-500 hover:bg-yellow-500 text-yellow-50 w-fit mt-1 flex items-center pointer-events-none"
              variant="secondary"
            >
              <PremiumIcon />
              Premium
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "projectType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <SortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("projectType") as keyof typeof typeColors;
      return (
        <Badge className={`${typeColors[type]} pointer-events-none`}>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "difficulty",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Difficulty
          <SortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const level = row.getValue("difficulty") as keyof typeof difficultyColors;
      return (
        <Badge className={`${difficultyColors[level]} pointer-events-none`}>
          {level.charAt(0) + level.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") as boolean;
      return (
        <Badge
          variant={isPublished ? "default" : "outline"}
          className="pointer-events-none"
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "userCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <UsersIcon />
          Users
          <SortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.getValue("userCount") as number;
      return <span className="text-sm font-medium">{count}</span>;
    },
  },
  {
    accessorKey: "stepsCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Steps
          <SortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.getValue("stepsCount") as number;
      return <span className="text-sm">{count}</span>;
    },
  },
  {
    accessorKey: "categoriesCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categories
          <SortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.getValue("categoriesCount") as number;
      return <span className="text-sm">{count}</span>;
    },
  },
  {
    accessorKey: "estimatedTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Duration
          <SortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const minutes = row.getValue("estimatedTime") as number;
      if (minutes < 60) return <span className="text-sm">{minutes}m</span>;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return (
        <span className="text-sm">
          {remainingMinutes === 0
            ? `${hours}h`
            : `${hours}h ${remainingMinutes}m`}
        </span>
      );
    },
  },
  {
    accessorKey: "estimatedCost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cost
          <SortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const cents = row.getValue("estimatedCost") as number;
      if (cents === 0) return <span className="text-sm">Free</span>;
      return <span className="text-sm">${(cents / 100).toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated
          <SortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      return (
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const project = row.original;
      const meta = table.options.meta as any;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => meta?.onView?.(project.id)}>
              <Eye className="mr-2 h-4 w-4" />
              Preview Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onEdit?.(project.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onDuplicate?.(project.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                meta?.onTogglePublish?.(project.id, !project.isPublished)
              }
            >
              {project.isPublished ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Publish
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => meta?.onDelete?.(project.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
