import { cn } from "@nexous-accounting/ui";

interface RecentActivityProps {
  className?: string;
}

export const RecentActivity = ({ className }: RecentActivityProps) => {
  return (
    <div className={cn("", className)}>
      <h1 className="text-xl sm:text-2xl">Recent Activity</h1>
    </div>
  );
};
