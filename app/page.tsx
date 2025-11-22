import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"
import { Package, AlertCircle } from "lucide-react"

export default async function HomePage() {
  const supabase = await getSupabaseServerClient()

  let products = null
  let dbError = false

  try {
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false })

    if (productsError) {
      dbError = true
      console.log("[v0] Products error:", productsError)
    } else {
      products = productsData
    }
  } catch (error) {
    dbError = true
    console.log("[v0] Database connection error:", error)
  }

  return (
    <div className="min-h-screen bg-black">
      {dbError && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 text-yellow-500">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">
                Banco de dados não configurado. Execute o script SQL no Supabase para criar as tabelas.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="relative py-32 bg-gradient-to-br from-pink-600/80 via-purple-700/80 to-blue-600/80 animate-in fade-in duration-1000">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-in slide-in-from-bottom-8 duration-1000">
            <h1 className="font-bold text-5xl lg:text-6xl text-white drop-shadow-2xl">Loja do Guh</h1>

            <p className="text-xl leading-relaxed text-white/95 drop-shadow-lg">
              Produtos selecionados com os melhores preços
            </p>

            <Button
              asChild
              size="lg"
              className="text-lg px-8 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-xl border-0 hover:scale-105 transition-transform duration-300"
            >
              <Link href="/produtos">Ver Produtos</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="font-bold text-4xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
              Nossos Produtos
            </h2>
            <p className="text-white/60">Clique para ser redirecionado à loja</p>
          </div>

          {!dbError && products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-in fade-in duration-700">
              <Package className="w-16 h-16 mx-auto text-white/20 mb-4" />
              <p className="text-white/60">Nenhum produto disponível no momento</p>
              {dbError && (
                <p className="text-yellow-500/80 text-sm mt-2">Configure o banco de dados para ver os produtos</p>
              )}
            </div>
          )}

          {products && products.length > 0 && (
            <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white border-0 hover:scale-105 transition-transform duration-300"
              >
                <Link href="/produtos">Ver Todos os Produtos</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
