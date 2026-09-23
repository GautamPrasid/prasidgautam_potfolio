import React from "react";
import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  if (!name) return <Icons.Share2 {...props} />;

  const formattedName = name.trim();
  const pascalName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);

  const nameMap: Record<string, string> = {
    Github: "Github",
    Linkedin: "Linkedin",
    Twitter: "Twitter",
    X: "Twitter",
    Instagram: "Instagram",
    Facebook: "Facebook",
    Youtube: "Youtube",
    Mail: "Mail",
    Email: "Mail",
    MessageCircle: "MessageCircle",
    Phone: "Phone",
    Location: "MapPin",
    MapPin: "MapPin",
  };

  const targetName = nameMap[pascalName] || pascalName;
  const IconComponent =
    (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[targetName] || Icons.Share2;

  return <IconComponent {...props} />;
}
