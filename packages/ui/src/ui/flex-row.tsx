import type React from "react"
import { cn } from "../libs/utils"

export const FlexRow = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        className,
      )}
      {...props}
    />
  )
}
