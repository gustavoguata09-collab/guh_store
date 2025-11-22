import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Eye, MousePointerClick, Calendar } from "lucide-react"
import Link from "next/link"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/admin/login")
  }

  // Buscar estatísticas detalhadas
  const [totalClicks, totalVisits, clicksThisMonth, visitsThisMonth, topProducts, recentClicks] = await Promise.all([
    supabase.from("product_clicks").select("*", { count: "exact", head: true }),
    supabase.from("site_visits").select("*", { count: "exact", head: true }),
    supabase
      .from("product_clicks")
      .select("*", { count: "exact", head: true })
      .gte("clicked_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase
      .from("site_visits")
      .select("*", { count: "exact", head: true })
      .gte("visited_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase
      .from("product_clicks")
      .select("product_id, products(name, image_url)")
      .limit(100)
      .then((res) => {
        const counts: Record<string, { name: string; count: number; image: string }> = {}
        res.data?.forEach((click: any) => {
          const id = click.product_id
          if (click.products) {
            if (!counts[id]) {
              counts[id] = { name: click.products.name, count: 0, image: click.products.image_url }
            }
            counts[id].count++
          }
        })
        return Object.values(counts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      }),
    supabase
      .from("product_clicks")
      .select("clicked_at, products(name)")
      .order("clicked_at", { ascending: false })
      .limit(10),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950/50 to-black">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-transparent bg-clip-text">
              Analytics & Relatórios
            </h1>
            <p className="text-white/60 mt-1">Acompanhe o desempenho da sua loja</p>
          </div>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border-cyan-500/30">
            <CardHeader className="pb-3">
              <CardDescription className="text-cyan-400">Total de Cliques</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-white">{totalClicks.count || 0}</div>
                <MousePointerClick className="w-12 h-12 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-400">Cliques este Mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-white">{clicksThisMonth.count || 0}</div>
                <Calendar className="w-12 h-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-400">Total de Visitas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-white">{totalVisits.count || 0}</div>
                <Eye className="w-12 h-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 border-pink-500/30">
            <CardHeader className="pb-3">
              <CardDescription className="text-pink-400">Visitas este Mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-white">{visitsThisMonth.count || 0}</div>
                <TrendingUp className="w-12 h-12 text-pink-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Produtos Mais Clicados */}
        <Card className="bg-gray-900/80 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white">Top 5 Produtos Mais Clicados</CardTitle>
            <CardDescription className="text-white/60">Produtos que geraram mais interesse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <p className="text-white/60 text-center py-4">Nenhum clique registrado ainda</p>
              ) : (
                topProducts.map((product: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-cyan-400 w-8">{index + 1}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{product.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-cyan-400">{product.count}</p>
                      <p className="text-xs text-white/60">cliques</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cliques Recentes */}
        <Card className="bg-gray-900/80 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Atividade Recente</CardTitle>
            <CardDescription className="text-white/60">Últimos 10 cliques em produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentClicks.data && recentClicks.data.length > 0 ? (
                recentClicks.data.map((click: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-white/5">
                    <p className="text-white">{click.products?.name || "Produto deletado"}</p>
                    <p className="text-xs text-white/60">{new Date(click.clicked_at).toLocaleString("pt-BR")}</p>
                  </div>
                ))
              ) : (
                <p className="text-white/60 text-center py-4">Nenhuma atividade recente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
