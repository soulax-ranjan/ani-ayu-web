import * as React from "react"
import { cn } from "../utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function Button({ className, variant="primary", size="md", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-xl font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition";
  const variants = {
    primary: "bg-primary text-white hover:opacity-95",
    outline: "border border-primary text-primary bg-white hover:bg-mint/50",
    ghost:   "bg-transparent text-primary hover:bg-mint/60",
  }[variant];
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  }[size];
  return <button className={cn(base, variants, sizes, className)} {...props} />
}
