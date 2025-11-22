import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PedidoDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PedidoDetailPage({ params }: PedidoDetailPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar pedido
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!order) {
    notFound()
  }

  // Buscar itens do pedido
  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id)

  const shippingAddress = order.shipping_address as any

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="font-bold text-balance text-4xl">
                Pedido #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-muted-foreground">
                Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/conta/pedidos">Voltar</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Informações do Pedido */}
            <div className="md:col-span-2 space-y-6">
              {/* Status */}
              <Card className="p-6">
                <h2 className="font-bold text-xl mb-4">Status do Pedido</h2>
                <div className="flex items-center gap-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                    {order.status === 'pending' ? 'Pendente' :
                     order.status === 'processing' ? 'Em processamento' :
                     order.status === 'shipped' ? 'Enviado' :
                     order.status === 'delivered' ? 'Entregue' :
                     order.status}
                  </span>
                </div>
              </Card>

              {/* Itens */}
              <Card className="p-6">
                <h2 className="font-bold text-xl mb-4">Itens do Pedido</h2>
                <div className="space-y-4">
                  {items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-start py-4 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {item.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Preço unitário: {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(item.product_price)}
                        </p>
                      </div>
                      <p className="font-bold">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Endereço de Entrega */}
              <Card className="p-6">
                <h2 className="font-bold text-xl mb-4">Endereço de Entrega</h2>
                <div className="space-y-1 text-muted-foreground">
                  <p className="font-medium text-foreground">{shippingAddress?.fullName}</p>
                  <p>{shippingAddress?.phone}</p>
                  <p>{shippingAddress?.street}, {shippingAddress?.number}</p>
                  {shippingAddress?.complement && <p>{shippingAddress.complement}</p>}
                  <p>{shippingAddress?.neighborhood}</p>
                  <p>{shippingAddress?.city} - {shippingAddress?.state}</p>
                  <p>CEP: {shippingAddress?.zipCode}</p>
                </div>
              </Card>

              {/* Observações */}
              {order.notes && (
                <Card className="p-6">
                  <h2 className="font-bold text-xl mb-4">Observações</h2>
                  <p className="text-muted-foreground">{order.notes}</p>
                </Card>
              )}
            </div>

            {/* Resumo */}
            <div className="md:col-span-1">
              <Card className="p-6 space-y-4 sticky top-4">
                <h2 className="font-bold text-xl">Resumo</h2>
                
                <div className="space-y-2 py-4 border-y">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(order.total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Entrega</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(order.total)}
                  </span>
                </div>

                <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                  <p className="capitalize">
                    <span className="font-medium text-foreground">Pagamento:</span>{' '}
                    {order.payment_method === 'pix' ? 'PIX' :
                     order.payment_method === 'card' ? 'Cartão' :
                     order.payment_method === 'boleto' ? 'Boleto' :
                     order.payment_method}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
