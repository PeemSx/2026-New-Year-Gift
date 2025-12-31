import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-amber-300 text-amber-950 shadow-lg shadow-amber-300/40 hover:bg-amber-200",
        ghost:
          "border border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10",
      },
      size: {
        md: "px-6 py-3",
        lg: "px-8 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(buttonVariants({ variant, size, className }))}
    {...props}
  />
));
Button.displayName = "Button";

export { Button, buttonVariants };
