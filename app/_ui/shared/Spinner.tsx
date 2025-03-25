import React from "react";
import { cn } from "@/lib/utils";

type SpinnerProps = React.ComponentProps<"div">;

export default function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      {...props}
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-4 border-emerald-200 border-t-transparent",
        className,
      )}
    />
  );
}
