import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FolderTree, BarChart3, LogOut, TrendingUp, ShoppingBag, Eye } from "lucide-react"
import Image from "next/image"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/admin/login")
  }

  // Estatísticas
  const [productsCount, categoriesCount, clicksCount, visitsCount] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("product_clicks").select("*", { count: "exact", head: true }),
    supabase.from("site_visits").select("*", { count: "exact", head: true }),
  ])

  const handleLogout = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950/50 to-black">
      <div className="container mx-auto p-6 pt-24 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/50 flex-shrink-0">
              <Image src="/logo.png" alt="Loja do Guh Logo" fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text">
                Painel Administrativo
              </h1>
              <p className="text-white/60 mt-2">Bem-vindo, {user.email}</p>
            </div>
          </div>
          <form action={handleLogout}>
            <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </form>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 border-pink-500/30">
            <CardHeader className="pb-3">
              <CardDescription className="text-pink-400">Total de Produtos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-white">{productsCount.count || 0}</div>
                <ShoppingBag className="w-12 h-12 text-pink-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-400">Categorias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-white">{categoriesCount.count || 0}</div>
                <FolderTree className="w-12 h-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border-cyan-500/30">
            <CardHeader className="pb-3">
              <CardDescription className="text-cyan-400">Cliques em Produtos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-white">{clicksCount.count || 0}</div>
                <TrendingUp className="w-12 h-12 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-400">Visitas ao Site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-white">{visitsCount.count || 0}</div>
                <Eye className="w-12 h-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/produtos">
            <Card className="bg-gray-900/80 border-pink-500/30 hover:border-pink-500/60 transition-all cursor-pointer h-full hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center text-pink-400">
                  <Package className="w-6 h-6 mr-3" />
                  Gerenciar Produtos
                </CardTitle>
                <CardDescription className="text-white/60">Adicionar, editar ou remover produtos</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/categorias">
            <Card className="bg-gray-900/80 border-purple-500/30 hover:border-purple-500/60 transition-all cursor-pointer h-full hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-400">
                  <FolderTree className="w-6 h-6 mr-3" />
                  Gerenciar Categorias
                </CardTitle>
                <CardDescription className="text-white/60">Organizar produtos por categoria</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="bg-gray-900/80 border-cyan-500/30 hover:border-cyan-500/60 transition-all cursor-pointer h-full hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <BarChart3 className="w-6 h-6 mr-3" />
                  Analytics & Relatórios
                </CardTitle>
                <CardDescription className="text-white/60">Ver estatísticas e fluxo de visitantes</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
