import { cn } from "@nexous-accounting/ui";

interface MonthlyCashFlowProps {
  className?: string;
}

export const MonthlyCashFlow = ({ className }: MonthlyCashFlowProps) => {
  return (
    <div className={cn("", className)}>
      <h1 className="text-xl sm:text-2xl">Monthly Cash Flow</h1>
    </div>
  )
}