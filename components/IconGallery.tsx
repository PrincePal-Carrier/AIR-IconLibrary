"use client";

import { useMemo, useState } from "react";
import {
  categories,
  iconLabel,
  matchesQuery,
  type IconEntry,
  type IconVariant,
} from "@/lib/icons";

export default function IconGallery({ icons }: { icons: IconEntry[] }) {
  const [query, setQuery] = useState("");
  const [variant, setVariant] = useState<IconVariant>("outlined");
  const [category, setCategory] = useState<string>("all");
  const [selected, setSelected] = useState<IconEntry | null>(null);

  const filtered = useMemo(() => {
    return icons.filter((icon) => {
      if (category !== "all" && icon.category !== category) return false;
      return matchesQuery(icon, query);
    });
  }, [icons, query, category]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-black/90">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight">
              Air Icon Library
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {icons.length} icons · click any icon for its link and download
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, alias, or category…"
              className="w-full flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="flex overflow-hidden rounded-lg border border-zinc-300 text-sm dark:border-zinc-700">
              {(["outlined", "filled"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={`px-3 py-2 capitalize transition-colors ${
                    variant === v
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                      : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <details className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
          <summary className="cursor-pointer font-medium text-zinc-700 dark:text-zinc-300">
            Usage guidelines: Outlined vs. Filled
          </summary>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Outlined is the default.</strong> Use it for
              navigation, app bars, and content areas whenever the action or
              state is inactive.
            </li>
            <li>
              <strong>Filled means active/selected.</strong> Use it to show
              the current selection in tabs, bottom navigation, or sidebars.
              Apply one style consistently within a component — don&apos;t
              mix outlined and filled arbitrarily in the same group.
            </li>
            <li>
              <strong>Filled can also add contrast</strong> (e.g. toasts,
              alerts) independent of selection state. Otherwise, retain
              whatever style the component or pattern already uses.
            </li>
          </ul>
          <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
            Full machine-readable version at{" "}
            <a href="/llms.txt" className="underline">
              /llms.txt
            </a>
            .
          </p>
        </details>
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No icons match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {filtered.map((icon) => (
              <li key={`${icon.categorySlug}-${icon.name}`}>
                <button
                  onClick={() => setSelected(icon)}
                  title={iconLabel(icon.name)}
                  className="flex w-full flex-col items-center gap-2 rounded-lg border border-transparent p-3 text-center transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  <img
                    src={icon[variant]}
                    alt={icon.name}
                    width={28}
                    height={28}
                    className="dark:invert"
                  />
                  <span className="line-clamp-2 w-full text-[11px] leading-tight text-zinc-600 dark:text-zinc-400">
                    {iconLabel(icon.name)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      {selected && (
        <IconDetail
          icon={selected}
          variant={variant}
          onVariantChange={setVariant}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function IconDetail({
  icon,
  variant,
  onVariantChange,
  onClose,
}: {
  icon: IconEntry;
  variant: IconVariant;
  onVariantChange: (v: IconVariant) => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const path = icon[variant];
  const absoluteUrl =
    typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold">{iconLabel(icon.name)}</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {icon.category}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center rounded-lg bg-zinc-50 py-8 dark:bg-zinc-800">
          <img src={path} alt={icon.name} width={40} height={40} className="dark:invert" />
        </div>

        <div className="mt-4 flex overflow-hidden rounded-lg border border-zinc-300 text-xs dark:border-zinc-700">
          {(["outlined", "filled"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onVariantChange(v)}
              className={`flex-1 py-1.5 capitalize transition-colors ${
                variant === v
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {icon.aliases.length > 0 && (
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            {icon.aliases.join(", ")}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => copy(absoluteUrl, "link")}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
          >
            {copied === "link" ? "Copied!" : "Copy icon link"}
          </button>
          <a
            href={path}
            download={`${icon.name}-${variant}.svg`}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-center text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Download SVG
          </a>
        </div>
      </div>
    </div>
  );
}
