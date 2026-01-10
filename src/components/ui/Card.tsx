import { cn } from "../utils";
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl bg-white ring-1 ring-black/5 shadow-card", className)} {...props} />
}
export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 md:p-5", className)} {...props} />
}
