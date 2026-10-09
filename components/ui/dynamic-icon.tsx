import type { ComponentType } from "react";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

export function DynamicIcon({ name, ...props }: LucideProps & { name: string }) {
  const key = (name || "Share2").trim();
  
  // Convert to PascalCase (handles lowercase, uppercase, mixed)
  const pascal = key
    .toLowerCase()
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  const aliases: Record<string, string> = {
    X: "Twitter",
    Email: "Mail",
    Location: "MapPin",
    Whatsapp: "MessageCircle",
    Website: "Globe",
  };
  
  const resolved = aliases[pascal] || pascal;
  const Icon =
    (Icons as unknown as Record<string, ComponentType<LucideProps>>)[resolved] || Icons.Share2;
  return <Icon {...props} />;
}
