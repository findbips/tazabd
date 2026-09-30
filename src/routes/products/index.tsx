import { createFileRoute, Link } from "@tanstack/react-router";
import { CategoryIcon } from "@/components/category-icon";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/products";
import { cn } from "@/lib/utils";

type ProductsSearch = {
  category?: string;
};

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { category } = Route.useSearch();
  const current = categories.find((c) => c.id === category);
  const list = category
    ? products.filter((p) => p.category === category)
    : products;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
        {current ? current.name : "All products"}
      </h1>
      <p className="mt-1 text-muted">
        {current
          ? current.nameBn
          : "Organic & natural goods from Bangladeshi farms"}
      </p>
      <p className="mt-2 text-sm text-muted">
        {list.length} product{list.length === 1 ? "" : "s"}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          to="/products"
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium",
            !category
              ? "bg-primary text-primary-fg"
              : "bg-surface text-fg ring-1 ring-border hover:bg-bg",
          )}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to="/products"
            search={{ category: cat.id }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium",
              category === cat.id
                ? "bg-primary text-primary-fg"
                : "bg-surface text-fg ring-1 ring-border hover:bg-bg",
            )}
          >
            <CategoryIcon name={cat.icon} className="size-3.5" />
            {cat.name}
          </Link>
        ))}
      </div>

      {list.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-muted">
          No products in this category yet.
        </p>
      )}
    </div>
  );
}
