import type { VariantProps } from "class-variance-authority";
import { useIsMobile } from "../libs/use-mobile";
import { Button, type buttonVariants } from "./button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { cn } from "../libs";

export interface SheetModalFooterAction {
  label: string;
  onClick?: () => void | Promise<void>;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  disabled?: boolean;
  isLoading?: boolean;
}

export interface SheetModalProps extends React.ComponentPropsWithoutRef<typeof Sheet> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  contentProps?: React.ComponentPropsWithoutRef<typeof SheetContent>;
  contentClassName?: string;
  overlayClassName?: string;
  footerProps?: React.ComponentPropsWithoutRef<typeof SheetFooter>;
  footerClassName?: string;
  children: React.ReactNode;
  actions?: SheetModalFooterAction[];
}

export function SheetModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  contentProps,
  contentClassName,
  overlayClassName,
  footerProps,
  footerClassName,
  actions = [],
  ...props
}: SheetModalProps) {
  const isMobile = useIsMobile();

  if (!isMobile)
    return (
      <Sheet open={open} onOpenChange={onOpenChange} {...props}>
        <SheetContent
          {...contentProps}
          className={cn(contentClassName)}
          overlayClassName={overlayClassName}
        >
          {(title || description) && (
            <SheetHeader>
              {title && <SheetTitle>{title}</SheetTitle>}
              {description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeader>
          )}
          <div className="px-4">{children}</div>
          {actions.length > 0 && (
            <SheetFooter {...footerProps} className={cn(footerClassName)}>
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
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={cn(contentClassName)}>
        <div className="mx-auto w-full max-w-sm"></div>
        {(title || description) && (
          <DrawerHeader className="mb-6">
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}
        <div className="no-scrollbar overflow-y-auto px-4">{children}</div>
        <DrawerFooter className={cn("mt-6", footerClassName)}>
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
