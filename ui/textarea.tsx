import * as React from "react";

import { cn } from "./utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "resize-none placeholder:text-muted-foreground focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-border-error/20 dark:aria-invalid:ring-border-error/40 aria-invalid:border-border-error dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border border-border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };