import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="p-4 rounded-3xl bg-primary/10 text-primary border border-primary/20">
        <FileQuestion className="w-12 h-12" />
      </div>

      <div className="space-y-3 max-w-md">
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Oops! The page or resource you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <Link
        href="/"
        className="px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center gap-2 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
