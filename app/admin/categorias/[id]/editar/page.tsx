import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CategoryForm } from "@/components/admin/category-form"

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/admin/login")
  }

  const { data: category } = await supabase.from("categories").select("*").eq("id", params.id).single()

  if (!category) {
    redirect("/admin/categorias")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950/50 to-black">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/categorias">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-transparent bg-clip-text">
            Editar Categoria
          </h1>
        </div>

        <CategoryForm category={category} />
      </div>
    </div>
  )
}
