import { Button, cn } from "@nexous/ui";
import { ArrowLeftIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  showBack?: boolean;
}

export default function PageHeader({ title, showBack = false, ...props }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center",
        props.className,
      )}
      {...props}
    >
      <div className="flex items-center">
        {showBack && (
          <Button variant="ghost" onClick={() => navigate(-1)} className="sm:hidden" size="icon-lg">
            <ArrowLeftIcon className="size-6" />
          </Button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      {props.children}
    </div>
  );
}
