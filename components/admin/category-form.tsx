"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CategoryFormProps {
  category?: {
    id: number
    name: string
    slug: string
    icon: string
  }
}

const ICONS = [
  { value: "Laptop", label: "💻 Laptop (Eletrônicos)" },
  { value: "Shirt", label: "👕 Shirt (Roupas)" },
  { value: "Home", label: "🏠 Home (Casa)" },
  { value: "Trophy", label: "🏆 Trophy (Esportes)" },
  { value: "Sparkles", label: "✨ Sparkles (Beleza)" },
  { value: "BookOpen", label: "📚 BookOpen (Livros)" },
  { value: "Smartphone", label: "📱 Smartphone (Celulares)" },
  { value: "Gamepad", label: "🎮 Gamepad (Games)" },
  { value: "Coffee", label: "☕ Coffee (Café/Cozinha)" },
  { value: "Music", label: "🎵 Music (Música)" },
]

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    icon: category?.icon || "Laptop",
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (category) {
        // Atualizar
        const { error } = await supabase.from("categories").update(formData).eq("id", category.id)

        if (error) throw error
      } else {
        // Criar
        const { error } = await supabase.from("categories").insert([formData])

        if (error) throw error
      }

      router.push("/admin/categorias")
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar categoria:", error)
      alert("Erro ao salvar categoria. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900/80 border-purple-500/30 max-w-2xl">
      <CardHeader>
        <CardTitle className="text-white">{category ? "Editar" : "Nova"} Categoria</CardTitle>
        <CardDescription className="text-white/60">Preencha os dados da categoria abaixo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Nome da Categoria
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Eletrônicos"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-white">
              Slug (URL amigável)
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="eletronicos"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
            <p className="text-sm text-white/40">Gerado automaticamente a partir do nome</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon" className="text-white">
              Ícone
            </Label>
            <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {ICONS.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value} className="text-white hover:bg-white/10">
                    {icon.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? "Salvando..." : category ? "Atualizar" : "Criar Categoria"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
