import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useAssistantState,
} from "@assistant-ui/react";
import { type FC } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { ShootingStars } from "../ui/shooting-stars";
import { StarsBackground } from "../ui/stars-background";
import ThinkingIndicator from "./thinking-indicator";

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root
      className="text-foreground inset-0 bg-background absolute box-border flex h-full flex-col overflow-hidden rounded-t-lg rounded-b-lg"
      style={{
        ["--thread-max-width" as string]: "100%",
      }}
    >
      <ThreadPrimitive.Viewport className="relative flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-3 pt-6 before:pointer-events-none before:sticky before:top-0 before:z-20 before:block before:h-8 before:-mb-8 before:w-full before:bg-gradient-to-b before:from-background before:to-transparent">
        <div className="relative w-full h-full flex flex-col z-10">
          <ThreadWelcome />

          <ThreadPrimitive.Messages
            components={{
              UserMessage: UserMessage,
              EditComposer: EditComposer,
              AssistantMessage: AssistantMessage,
            }}
          />

          <ThreadPrimitive.If empty={false}>
            <div className="min-h-8 flex-grow" />
          </ThreadPrimitive.If>

          <div className="sticky bottom-0 mt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end pb-4 pt-3 bg-background before:absolute before:inset-x-0 before:bottom-full before:h-8 before:bg-gradient-to-t before:from-background before:to-transparent">
            <ThreadScrollToBottom />
            <Composer />
          </div>
        </div>
        <ShootingStars starColor="#059669" maxDelay={3000} minDelay={2000} />
        <StarsBackground starDensity={0.00055} />
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 bg-accent dark:bg-accent/30 rounded-full disabled:invisible"
      >
        <ArrowDownIcon className="size-4" />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col items-center justify-center px-2">
        <h2 className="relative z-10 text-3xl md:text-4xl max-w-5xl mx-auto text-center tracking-tight font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 via-neutral-100 to-white dark:from-neutral-700 dark:via-neutral-200 dark:to-white">
          Clouddojo AI
        </h2>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Ask me anything about cloud certifications
        </p>
        <ThreadWelcomeSuggestions />
      </div>
    </ThreadPrimitive.Empty>
  );
};

const ThreadWelcomeSuggestions: FC = () => {
  return (
    <div className="flex w-full flex-col items-stretch gap-2.5 mt-6">
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/60 hover:border-muted-foreground/20 flex items-center justify-center rounded-xl border border-border/50 px-4 py-3 transition-all duration-200 ease-out cursor-pointer"
        prompt="What is Amazon S3?"
        method="replace"
        autoSend
      >
        <span className="text-sm font-medium text-foreground/80">
          What is Amazon S3?
        </span>
      </ThreadPrimitive.Suggestion>
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/60 hover:border-muted-foreground/20 flex items-center justify-center rounded-xl border border-border/50 px-4 py-3 transition-all duration-200 ease-out cursor-pointer"
        prompt="What is Google Cloud Run?"
        method="replace"
        autoSend
      >
        <span className="text-sm font-medium text-foreground/80">
          What is Google Cloud Run?
        </span>
      </ThreadPrimitive.Suggestion>
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/60 hover:border-muted-foreground/20 flex items-center justify-center rounded-xl border border-border/50 px-4 py-3 transition-all duration-200 ease-out cursor-pointer"
        prompt="Explain AWS IAM roles"
        method="replace"
        autoSend
      >
        <span className="text-sm font-medium text-foreground/80">
          Explain AWS IAM roles
        </span>
      </ThreadPrimitive.Suggestion>
    </div>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="flex w-full items-end gap-2 rounded-2xl border border-border/50 bg-muted/30 px-4 py-2 shadow-sm transition-all duration-200 focus-within:border-emerald-500/50 focus-within:bg-muted/50">
      <ComposerPrimitive.Input
        rows={1}
        autoFocus
        placeholder="Ask anything about cloud..."
        className="placeholder:text-muted-foreground/60 max-h-[120px] flex-grow resize-none border-none bg-transparent py-2 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ComposerAction />
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send"
            variant="default"
            className="size-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors"
          >
            <ArrowUpIcon className="text-white size-4" />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Cancel"
            variant="default"
            className="size-8 rounded-xl bg-red-600 hover:bg-red-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-label="Stop"
            >
              <title>Stop</title>
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid auto-rows-auto grid-cols-[minmax(48px,1fr)_auto] gap-y-1 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-2">
      <UserActionBar />

      <div className="bg-muted text-foreground text-sm  break-words rounded-2xl px-3 py-2 col-start-2 row-start-2">
        <MessagePrimitive.Parts />
      </div>

      <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="flex flex-col items-end col-start-1 row-start-2 mr-2 mt-1.5"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit" className="size-6">
          <PencilIcon className="size-3" />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="bg-muted my-2 flex w-full max-w-[var(--thread-max-width)] flex-col items-center gap-2 rounded-xl">
      <ComposerPrimitive.Input className="text-foreground text-xs flex h-8 w-full resize-none bg-transparent p-3 pb-0 outline-none" />

      <div className="mx-2 mb-2 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel asChild>
          <Button variant="ghost" size="sm" className="text-xs h-7">
            Cancel
          </Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button size="sm" className="text-xs h-7">
            Send
          </Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

const AssistantMessage: FC = () => {
  const isRunning = useAssistantState(
    ({ message }) => message.status?.type === "running",
  );
  const hasContent = useAssistantState(({ message }) => {
    const content = message.content;
    return (
      content &&
      content.length > 0 &&
      content.some(
        (part) => part.type === "text" && part.text && part.text.length > 0,
      )
    );
  });

  return (
    <MessagePrimitive.Root className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-2">
      <div className="text-foreground text-sm max-w-[95%] break-words leading-6 col-span-2 col-start-2 row-start-1 my-1">
        {isRunning && !hasContent && <ThinkingIndicator />}
        <MessagePrimitive.Parts components={{ Text: MarkdownText }} />
        <MessageError />
      </div>

      <AssistantActionBar />

      <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
    </MessagePrimitive.Root>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="border-destructive bg-destructive/10 dark:text-red-200 dark:bg-destructive/5 text-destructive mt-2 rounded-md border p-2 text-xs">
        <ErrorPrimitive.Message className="line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-muted-foreground flex gap-1 col-start-3 row-start-2 -ml-1 data-[floating]:bg-background data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy" className="size-6">
          <MessagePrimitive.If copied>
            <CheckIcon className="size-3" />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon className="size-3" />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh" className="size-6">
          <RefreshCwIcon className="size-3" />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "text-muted-foreground inline-flex items-center text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous" className="size-5">
          <ChevronLeftIcon className="size-3" />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium text-[10px]">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next" className="size-5">
          <ChevronRightIcon className="size-3" />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};
