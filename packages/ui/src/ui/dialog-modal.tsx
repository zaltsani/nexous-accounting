import type { VariantProps } from "class-variance-authority";
import { useIsMobile } from "../libs/use-mobile";
import { Button, type buttonVariants } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogSize,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./drawer";

export interface FooterAction {
  label: string;
  onClick?: () => void | Promise<void>;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  disabled?: boolean;
  isLoading?: boolean;
}

export interface DialogModalProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  contentProps?: React.ComponentPropsWithoutRef<typeof DialogContent>;
  children: React.ReactNode;
  actions?: FooterAction[];
  size?: DialogSize;
}

export function DialogModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  contentProps,
  actions = [],
  size = "md",
  ...props
}: DialogModalProps) {
  const isMobile = useIsMobile();

  if (!isMobile)
    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...props}>
        <DialogContent {...contentProps} size={size}>
          {(title || description) && (
            <DialogHeader size={size}>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
          )}
          {children}

          {actions.length > 0 && (
            <DialogFooter size={size}>
              {actions.map((action, index) => {
                const defaultVariant = index === 0 ? "outline" : "default";
                const handleButtonClick = () => {
                  if (action.onClick) action.onClick();
                  else onOpenChange?.(false);
                };
                return (
                  <Button
                    key={`${action.label}-${index}`}
                    variant={action.variant || defaultVariant}
                    onClick={handleButtonClick}
                    disabled={action.disabled || action.isLoading}
                  >
                    {action.isLoading ? "Loading..." : action.label}
                  </Button>
                );
              })}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm"></div>
        {(title || description) && (
          <DrawerHeader>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}
        <div className="no-scrollbar overflow-y-auto px-4">{children}</div>
        <DrawerFooter className="grid grid-cols-2">
          {actions.length > 0 ? (
            actions.map((action, index) => {
              const defaultVariant = index === 0 ? "outline" : "default";
              const handleButtonClick = () => {
                if (action.onClick) action.onClick();
                else onOpenChange?.(false);
              };
              return (
                <Button
                  key={`${action.label}-${index}`}
                  variant={action.variant || defaultVariant}
                  onClick={handleButtonClick}
                  disabled={action.disabled || action.isLoading}
                >
                  {action.isLoading ? "Loading..." : action.label}
                </Button>
              );
            })
          ) : (
            <Button render={<DrawerClose />}>Tutup</Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
