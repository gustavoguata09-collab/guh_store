import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/admin/login")
  }

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950/50 to-black">
      <div className="container mx-auto p-6 space-y-6 max-w-3xl">
        <div className="flex items-center gap-4">
          <Link href="/admin/produtos">
            <Button
              variant="outline"
              size="icon"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Novo Produto</h1>
            <p className="text-white/60">Adicione um novo produto à loja</p>
          </div>
        </div>

        <ProductForm categories={categories || []} />
      </div>
    </div>
  )
}
