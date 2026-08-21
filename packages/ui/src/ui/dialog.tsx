import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "../libs/utils";
import { Button } from "./button";
import { cva, type VariantProps } from "class-variance-authority";

export type DialogSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "5xl" | "full";

const dialogContentVariants = cva(
  "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  {
    variants: {
      size: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl md:min-w-xl",
        "2xl": "max-w-2xl md:min-w-2xl px-8 py-6 gap-6",
        "5xl": "max-w-5xl md:min-w-5xl px-8 py-6 gap-6",
        full: "max-w-[95vw] h-[95vh] px-8 py-6 gap-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const dialogHeaderVariants = cva("flex flex-col gap-2 border-b", {
  variants: {
    size: {
      xs: "-mx-4 -mt-2 p-4",
      sm: "-mx-4 -mt-2 p-4",
      md: "-mx-4 -mt-2 p-4",
      lg: "-mx-4 -mt-2 p-4",
      xl: "-mx-4 -mt-2 p-4",
      "2xl": "-mx-8 -mt-6 px-8 py-6",
      "5xl": "-mx-8 -mt-6 px-8 py-6",
      full: "-mx-8 -mt-6 px-8 py-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const dialogFooterVariants = cva(
  "flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 sm:flex-row sm:justify-end",
  {
    variants: {
      size: {
        xs: "-mx-4 -mb-4 p-4",
        sm: "-mx-4 -mb-4 p-4",
        md: "-mx-4 -mb-4 p-4",
        lg: "-mx-4 -mb-4 p-4",
        xl: "-mx-4 -mb-4 p-4",
        "2xl": "-mx-8 -mb-6 px-8 py-6",
        "5xl": "-mx-8 -mb-6 px-8 py-6",
        full: "-mx-8 -mb-6 px-8 py-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

interface DialogContentProps
  extends DialogPrimitive.Popup.Props, VariantProps<typeof dialogContentVariants> {
  showCloseButton?: boolean;
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button variant="ghost" className="absolute top-2 right-2" size="icon-sm">
                <XIcon />
                <span className="sr-only">Close</span>
              </Button>
            }
          />
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

interface DialogHeaderProps
  extends React.ComponentProps<"div">, VariantProps<typeof dialogFooterVariants> {}

function DialogHeader({ className, size = "md", ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(dialogHeaderVariants({ size }), className)}
      {...props}
    />
  );
}

interface DialogFooterProps
  extends React.ComponentProps<"div">, VariantProps<typeof dialogFooterVariants> {
  showCloseButton?: boolean;
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  size = "md",
  ...props
}: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(dialogFooterVariants({ size }), className)}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline">Close</Button>} />
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("cn-font-heading text-base leading-none font-medium", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
