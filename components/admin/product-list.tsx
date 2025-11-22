"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  affiliate_link: string
  category: { name: string; icon: string }
}

export function ProductList({ products }: { products: Product[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      console.log("[v0] Deletando produto:", deleteId)

      const { error } = await supabase.from("products").delete().eq("id", deleteId)

      if (error) {
        console.error("[v0] Erro ao deletar:", error)
        throw error
      }

      console.log("[v0] Produto deletado com sucesso!")

      toast({
        title: "Produto deletado",
        description: "O produto foi removido com sucesso.",
      })

      setDeleteId(null)
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Erro ao deletar produto:", error)
      toast({
        title: "Erro ao deletar",
        description: error.message || "Não foi possível deletar o produto. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Card
            key={product.id}
            className="bg-gray-900/80 border-purple-500/30 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative h-48">
              <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg text-white line-clamp-1">{product.name}</h3>
                <p className="text-sm text-white/60 line-clamp-2">{product.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-pink-400">R$ {product.price.toFixed(2)}</p>
                  <p className="text-xs text-white/60">{product.category?.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/produtos/${product.id}/editar`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 bg-transparent"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setDeleteId(product.id)}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {product.affiliate_link && (
                  <Link href={product.affiliate_link} target="_blank">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-gray-900 border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white border-white/20 hover:bg-gray-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
