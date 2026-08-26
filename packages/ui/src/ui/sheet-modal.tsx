import type { VariantProps } from "class-variance-authority";
import { useIsMobile } from "../libs/use-mobile";
import { Button, type buttonVariants } from "./button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "./drawer";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "./sheet";

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
  actions = [],
  ...props
}: SheetModalProps) {
  const isMobile = useIsMobile();

  if (!isMobile) return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      {...props}
    >
      <SheetContent {...contentProps}>
        {(title || description) && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        {children}

        {actions.length > 0 && (
          <SheetFooter>
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
  )

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
        </div>
        {(title || description) && (
          <DrawerHeader>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}
        <div className="no-scrollbar overflow-y-auto px-4">
          {children}
        </div>
        <DrawerFooter className="grid grid-cols-2">
          {actions.length > 0 ? actions.map((action, index) => {
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
          }) : (
            <Button
              render={<DrawerClose />}
            >
              Tutup
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}