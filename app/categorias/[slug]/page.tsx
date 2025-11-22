import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import * as Icons from "lucide-react"
import type { Product } from "@/lib/types"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

  // Buscar categoria
  const { data: category } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (!category) {
    notFound()
  }

  // Buscar produtos da categoria
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false })

  const IconComponent = (Icons as any)[category.icon || "Package"]

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Cabeçalho da Categoria */}
        <div className="mb-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <IconComponent className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-bold text-balance text-4xl">{category.name}</h1>
          {category.description && (
            <p className="text-pretty text-lg text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
          )}
        </div>

        {/* Lista de Produtos */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria</p>
          </div>
        )}
      </div>
    </div>
  )
}
