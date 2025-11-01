"use client";

import { ColumnDef } from "@tanstack/react-table";
import { QuizListItem } from "./actions";
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
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Globe,
  EyeOff,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { getProviderLogo } from "../upload/lib/provider-logos";

const difficultyColors = {
  BEGINER:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  INTERMEDIATE:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  ADVANCED:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
  EXPERT: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
};

export const columns: ColumnDef<QuizListItem>[] = [
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
    accessorKey: "thumbnail",
    header: "Preview",
    cell: ({ row }) => {
      const thumbnail = row.getValue("thumbnail") as string | null;
      return (
        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={row.getValue("title")}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground">No img</span>
          )}
        </div>
      );
    },
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="max-w-[300px]">
          <p className="font-medium truncate">{title}</p>
          {row.original.description && (
            <p className="text-xs text-muted-foreground truncate">
              {row.original.description}
            </p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "level",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Difficulty
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const level = row.getValue("level") as keyof typeof difficultyColors;
      if (!level) return <span className="text-xs text-muted-foreground">-</span>;
      return (
        <Badge className={difficultyColors[level]}>
          {level.charAt(0) + level.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Duration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number | null;
      return duration ? (
        <span className="text-sm">{duration} min</span>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Questions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.original._count.questions;
      return <span className="text-sm font-medium">{count}</span>;
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original._count.questions - rowB.original._count.questions;
    },
  },
  {
    accessorKey: "providers",
    header: "Providers",
    cell: ({ row }) => {
      const providers = row.getValue("providers") as string[];
      if (!providers || providers.length === 0) {
        return <span className="text-xs text-muted-foreground">-</span>;
      }
      return (
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {providers.slice(0, 2).map((provider) => {
            const logoUrl = getProviderLogo(provider);
            return logoUrl ? (
              <img
                key={provider}
                src={logoUrl}
                alt={provider}
                title={provider}
                className="w-5 h-5 object-contain"
              />
            ) : (
              <Badge key={provider} variant="secondary" className="text-xs">
                {provider}
              </Badge>
            );
          })}
          {providers.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{providers.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "free",
    header: "Access",
    cell: ({ row }) => {
      const free = row.getValue("free") as boolean | null;
      if (free === null) {
        return <span className="text-xs text-muted-foreground">-</span>;
      }
      return (
        <Badge variant={free ? "default" : "secondary"}>
          {free ? "Free" : "Premium"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isPublic",
    header: "Visibility",
    cell: ({ row }) => {
      const isPublic = row.getValue("isPublic") as boolean;
      return (
        <Badge variant={isPublic ? "default" : "outline"}>
          {isPublic ? "Public" : "Private"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
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
      const quiz = row.original;
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
            <DropdownMenuItem onClick={() => meta?.onView?.(quiz.id)}>
              <Eye className="mr-2 h-4 w-4" />
              Preview Quiz
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onEdit?.(quiz.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Quiz
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onDuplicate?.(quiz.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => meta?.onToggleVisibility?.(quiz.id, !quiz.isPublic)}
            >
              {quiz.isPublic ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Make Private
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Make Public
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => meta?.onToggleAccess?.(quiz.id, !quiz.free)}
            >
              {quiz.free ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Make Premium
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Make Free
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => meta?.onDelete?.(quiz.id)}
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
