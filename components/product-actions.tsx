"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { Product } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface ProductActionsProps {
  product: Product
}

export function ProductActions({ product }: ProductActionsProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleViewOffer = async () => {
    if (!product.affiliate_link) return

    setIsRedirecting(true)

    // Registrar clique no analytics
    const supabase = createClient()
    await supabase.from("product_clicks").insert({
      product_id: product.id,
      user_ip: "",
      user_agent: navigator.userAgent,
    })

    // Redirecionar para link de afiliado (Shopee, AliExpress, etc)
    window.open(product.affiliate_link, "_blank", "noopener,noreferrer")

    setTimeout(() => setIsRedirecting(false), 1000)
  }

  return (
    <div className="flex gap-4">
      <Button
        onClick={handleViewOffer}
        size="lg"
        className="flex-1 gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 hover:scale-105"
        disabled={isRedirecting || !product.affiliate_link}
      >
        <ExternalLink className="w-5 h-5" />
        {isRedirecting ? "Abrindo oferta..." : "Ver Oferta na Loja"}
      </Button>
    </div>
  )
}
