import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"

export default async function ProdutosPage() {
  const supabase = await getSupabaseServerClient()

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-8 sm:py-12 lg:py-16 pt-16">
      <div className="container mx-auto px-4">
        <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12 text-center">
          <h1 className="font-bold text-balance text-3xl sm:text-4xl lg:text-5xl text-purple-600">Todos os Produtos</h1>
          <p className="text-pretty text-muted-foreground text-base sm:text-lg">
            Explore nossa coleção completa de produtos selecionados
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
