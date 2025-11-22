import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CategoryList } from "@/components/admin/category-list"

export default async function CategoriesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/admin/login")
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*, products(count)")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950/50 to-black">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-transparent bg-clip-text">
                Gerenciar Categorias
              </h1>
              <p className="text-white/60 mt-1">Adicione, edite ou remova categorias de produtos</p>
            </div>
          </div>
          <Link href="/admin/categorias/nova">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </Link>
        </div>

        {/* Lista de Categorias */}
        <Card className="bg-gray-900/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Todas as Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryList categories={categories || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
