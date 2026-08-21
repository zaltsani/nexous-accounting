import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "../libs/utils"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

function RadioGroupWrapper({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "p-3 pl-4 rounded-md flex items-center gap-3 border border-border cursor-pointer transition-colors",
        "hover:bg-muted/50",
        "has-[[data-slot=radio-group-item]:focus-visible]:border-ring has-[[data-slot=radio-group-item]:focus-visible]:ring-3 has-[[data-slot=radio-group-item]:focus-visible]:ring-ring/50",
        "has-[[data-slot=radio-group-item][data-state=checked]]:border-primary has-[[data-slot=radio-group-item][data-state=checked]]:bg-primary/5",
        "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupWrapper }
