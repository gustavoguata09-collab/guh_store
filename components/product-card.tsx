"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { Product } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleViewOffer = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.affiliate_link) {
      setIsRedirecting(true)

      // Registrar clique no analytics
      try {
        const supabase = createClient()
        await supabase.from("product_clicks").insert({
          product_id: product.id,
          user_ip: "",
          user_agent: navigator.userAgent,
        })
      } catch (error) {
        console.error("[v0] Erro ao registrar clique:", error)
      }

      // Redirecionar para link de afiliado
      window.open(product.affiliate_link, "_blank", "noopener,noreferrer")

      setTimeout(() => setIsRedirecting(false), 1000)
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex-1 flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20">
          <Image
            src={product.image_url || `/placeholder.svg?height=500&width=500&query=${encodeURIComponent(product.name)}`}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {product.category && (
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-500/30">
              <span className="text-xs font-semibold uppercase text-purple-400">{product.category.name}</span>
            </div>
          )}
        </div>

        <div className="p-5 space-y-3 flex-1 flex flex-col bg-gradient-to-br from-gray-900 to-gray-950">
          <h3 className="font-bold text-xl line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all text-white">
            {product.name}
          </h3>

          {product.description && <p className="text-sm text-white/60 line-clamp-2">{product.description}</p>}

          <div className="flex items-baseline gap-2 pt-2 mt-auto">
            <span className="font-bold text-3xl bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(product.price)}
            </span>
          </div>

          <div className="pt-3">
            <Button
              onClick={handleViewOffer}
              size="lg"
              className="w-full min-h-[48px] gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold transition-all duration-300"
              disabled={isRedirecting || !product.affiliate_link}
            >
              <ExternalLink className="w-4 h-4" />
              {isRedirecting ? "Redirecionando..." : "Ver Oferta"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
