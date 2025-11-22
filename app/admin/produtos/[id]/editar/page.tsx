import { notFound, redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Buscar produto
  const { data: product, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single()

  if (error || !product) {
    notFound()
  }

  // Buscar categorias
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-900 via-purple-950/50 to-black">
      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/produtos">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-transparent bg-clip-text">
              Editar Produto
            </h1>
            <p className="text-white/60">Atualize as informações do produto</p>
          </div>
        </div>

        <ProductForm product={product} categories={categories || []} />
      </div>
    </div>
  )
}
