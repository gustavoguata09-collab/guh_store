import { notFound } from "next/navigation"
import Image from "next/image"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { ProductActions } from "@/components/product-actions"
import type { Product } from "@/lib/types"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

  const { data: product } = await supabase.from("products").select("*, category:categories(*)").eq("id", slug).single()

  if (!product) {
    notFound()
  }

  // Buscar produtos relacionados
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4)

  return (
    <div className="min-h-screen py-6 sm:py-8 lg:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="container mx-auto px-4">
        <div className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap">
          <a href="/" className="hover:text-foreground">
            Início
          </a>
          {" / "}
          <a href="/produtos" className="hover:text-foreground">
            Produtos
          </a>
          {product.category && (
            <>
              {" / "}
              <a href={`/categorias/${product.category.slug}`} className="hover:text-foreground">
                {product.category.name}
              </a>
            </>
          )}
          {" / "}
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Produto */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20 shadow-xl">
              <Image
                src={
                  product.image_url || `/placeholder.svg?height=800&width=800&query=${encodeURIComponent(product.name)}`
                }
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-4 sm:space-y-6">
            {product.category && (
              <span className="inline-block text-sm font-semibold text-purple-400 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/30">
                {product.category.name}
              </span>
            )}

            <h1 className="font-bold text-balance text-2xl sm:text-3xl lg:text-4xl text-white">{product.name}</h1>

            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(product.price)}
            </div>

            {product.description && (
              <p className="text-pretty text-base sm:text-lg text-white/70 leading-relaxed">{product.description}</p>
            )}

            <ProductActions product={product} />
          </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section>
            <h2 className="font-bold text-balance text-2xl sm:text-3xl mb-6 sm:mb-8 text-white">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct: Product) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
