import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { products } from "@/data/site";
import { getProductPriceMap } from "@/lib/product-prices";
import { formatNaira } from "@/lib/store";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { CTA } from "@/components/Sections";

export const metadata = { title: "Search products" };

function normalize(value: string) {
  return value.toLowerCase().replace(/[®™]/g, "").trim();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = normalize(q);
  const prices = await getProductPriceMap();

  const results = query
    ? products.filter((product) =>
        normalize(
          `${product.name} ${product.category} ${product.summary} ${product.slug}`
        ).includes(query)
      )
    : products;

  return (
    <>
      <main className="search-page">
        <section className="search-hero">
          <div className="container search-hero-inner">
            <span className="eyebrow">Find a Bridgecare product</span>
            <h1>Search products</h1>
            <p>Search by product name, category or wellness area.</p>
            <form action="/search" method="get" role="search" className="site-search-form">
              <Search size={21} aria-hidden="true" />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search Bridgecare products"
                aria-label="Search Bridgecare products"
                autoFocus
              />
              <button type="submit" aria-label="Search">
                <ArrowRight size={21} />
              </button>
            </form>
          </div>
        </section>

        <section className="section search-results-section">
          <div className="container">
            <div className="search-results-heading">
              <div>
                <span className="eyebrow">Products</span>
                <h2>
                  {query
                    ? `${results.length} result${results.length === 1 ? "" : "s"} for “${q}”`
                    : "All Bridgecare products"}
                </h2>
              </div>
              {query && (
                <Link className="text-link" href="/search">
                  Clear search
                </Link>
              )}
            </div>

            {results.length > 0 ? (
              <div className="product-grid search-product-grid">
                {results.map((product) => {
                  const priceKobo = prices[product.slug] ?? product.priceKobo;
                  return (
                    <article className={`product-card ${product.accent}`} key={product.slug}>
                      <Link href={`/products/${product.slug}`} className="product-image-wrap">
                        <Image
                          src={product.image}
                          alt={`${product.name} product pack`}
                          fill
                          sizes="(max-width: 700px) 45vw, (max-width: 1100px) 30vw, 25vw"
                          className="product-image"
                        />
                      </Link>
                      <span className="eyebrow product-category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p className="product-summary">{product.summary}</p>
                      <strong className="product-price">{formatNaira(priceKobo)}</strong>
                      <div className="product-card-actions">
                        <AddToCartButton
                          slug={product.slug}
                          name={product.name}
                          priceKobo={priceKobo}
                        />
                        <Link className="text-link" href={`/products/${product.slug}`}>
                          View details <ArrowRight size={16} />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="search-empty">
                <Search size={30} aria-hidden="true" />
                <h3>No products found</h3>
                <p>Try a product name such as AsFenositol, Aspivit, Globivida or Herbal Bitter Tea.</p>
                <Link className="button" href="/products">View all products</Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <CTA />
    </>
  );
}
