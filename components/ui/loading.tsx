import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  className?: string;
  size?: number;
}

export function Loading({ className, size = 24 }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className="animate-spin" size={size} />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loading size={32} />
    </div>
  );
}

export function LoadingSection() {
  return (
    <div className="flex h-32 w-full items-center justify-center">
      <Loading size={24} />
    </div>
  );
} 