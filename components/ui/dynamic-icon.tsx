import type { ComponentType } from "react";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

export function DynamicIcon({ name, ...props }: LucideProps & { name: string }) {
  const key = (name || "Share2").trim();
  const pascal = key.charAt(0).toUpperCase() + key.slice(1);
  const aliases: Record<string, string> = {
    X: "Twitter",
    Email: "Mail",
    Location: "MapPin",
  };
  const resolved = aliases[pascal] || pascal;
  const Icon =
    (Icons as unknown as Record<string, ComponentType<LucideProps>>)[resolved] || Icons.Share2;
  return <Icon {...props} />;
}
