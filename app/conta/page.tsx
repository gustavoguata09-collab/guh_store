import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { EditProfileForm } from '@/components/edit-profile-form'

export default async function ContaPage() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Buscar pedidos recentes
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="font-bold text-balance text-4xl">Minha Conta</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações e pedidos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Menu Lateral */}
            <div className="space-y-2">
              <Link href="/conta">
                <Button variant="default" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Meus Dados
                </Button>
              </Link>
              <Link href="/conta/pedidos">
                <Button variant="ghost" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Meus Pedidos
                </Button>
              </Link>
            </div>

            {/* Conteúdo Principal */}
            <div className="md:col-span-2 space-y-6">
              {/* Informações do Perfil */}
              <Card className="p-6 space-y-4">
                <h2 className="font-bold text-xl">Informações Pessoais</h2>
                <EditProfileForm user={user} profile={profile} />
              </Card>

              {/* Pedidos Recentes */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-xl">Pedidos Recentes</h2>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/conta/pedidos">Ver todos</Link>
                  </Button>
                </div>

                {orders && orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/conta/pedidos/${order.id}`}
                        className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(order.total)}
                            </p>
                            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {order.status === 'pending' ? 'Pendente' : order.status}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Você ainda não fez nenhum pedido</p>
                    <Button asChild className="mt-4">
                      <Link href="/produtos">Começar a Comprar</Link>
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
