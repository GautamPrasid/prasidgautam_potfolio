import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="w-full flex flex-col flex-1 animate-fadein pb-20 lg:pb-0 lg:pl-16 xl:pl-20 2xl:pl-0">
      {children}
    </div>
  );
}
