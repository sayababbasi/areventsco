import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbJsonLd } from "./JsonLd";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ name: "Home", url: "/" }, ...items];

  return (
    <>
      <BreadcrumbJsonLd items={allItems} />
      <nav aria-label="Breadcrumb" className="py-2.5 px-4 bg-brand-warm-50/80 rounded-xl border border-brand-warm-200 text-xs inline-flex max-w-full overflow-x-auto">
        <ol className="flex items-center space-x-2 text-brand-navy-600 shrink-0">
          <li>
            <Link
              href="/"
              className="hover:text-brand-gold-600 transition-colors flex items-center space-x-1"
            >
              <Home className="w-3.5 h-3.5 text-brand-navy-400" />
              <span>Home</span>
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="flex items-center space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-brand-warm-400 shrink-0" />
                {isLast ? (
                  <span className="font-semibold text-brand-navy-950 truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-brand-gold-600 transition-colors truncate max-w-[150px]"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
