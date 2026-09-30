import {
  Apple,
  Droplets,
  Flame,
  FlaskConical,
  Flower2,
  Leaf,
  Milk,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/products";

const ICONS: Record<Category["icon"], LucideIcon> = {
  apple: Apple,
  leaf: Leaf,
  droplet: Droplets,
  flame: Flame,
  wheat: Wheat,
  flask: FlaskConical,
  milk: Milk,
  flower: Flower2,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: Category["icon"];
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} strokeWidth={1.75} />;
}
