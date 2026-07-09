import rawIcons from "@/data/icons.json";

export type IconVariant = "outlined" | "filled";

export interface IconEntry {
  name: string;
  category: string;
  categorySlug: string;
  aliases: string[];
  outlined: string;
  filled: string;
}

export const icons: IconEntry[] = rawIcons as IconEntry[];

export const categories: string[] = Array.from(
  new Set(icons.map((icon) => icon.category))
).sort((a, b) => a.localeCompare(b));

export function iconLabel(name: string): string {
  return name.replace(/_/g, " ");
}

export function matchesQuery(icon: IconEntry, query: string): boolean {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (icon.name.toLowerCase().includes(q)) return true;
  if (icon.category.toLowerCase().includes(q)) return true;
  return icon.aliases.some((alias) => alias.toLowerCase().includes(q));
}
