import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function PedidosPage() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="font-bold text-balance text-4xl">Meus Pedidos</h1>
              <p className="text-muted-foreground">
                Acompanhe todos os seus pedidos
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/conta">Voltar</Link>
            </Button>
          </div>

          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order.id} href={`/conta/pedidos/${order.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">
                            Pedido #{order.id.slice(0, 8).toUpperCase()}
                          </h3>
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {order.status === 'pending' ? 'Pendente' :
                             order.status === 'processing' ? 'Em processamento' :
                             order.status === 'shipped' ? 'Enviado' :
                             order.status === 'delivered' ? 'Entregue' :
                             order.status}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="capitalize">
                            Pagamento: {order.payment_method === 'pix' ? 'PIX' :
                                       order.payment_method === 'card' ? 'Cartão' :
                                       order.payment_method === 'boleto' ? 'Boleto' :
                                       order.payment_method}
                          </p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-bold text-2xl text-primary">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(order.total)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-muted-foreground">
                    Você ainda não realizou nenhum pedido
                  </p>
                </div>
                <Button asChild>
                  <Link href="/produtos">Começar a Comprar</Link>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
