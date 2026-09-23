import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="w-full flex flex-col flex-1 animate-fadein">
      {children}
    </div>
  );
}
