"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Upload, Link2 } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  categories: Category[]
  product?: any
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    image_url: product?.image_url || "",
    affiliate_link: product?.affiliate_link || "",
    category_id: product?.category_id || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione apenas arquivos de imagem")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB")
      return
    }

    setUploadingFile(true)
    setError(null)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { data, error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath)

      setFormData({ ...formData, image_url: publicUrl })
      toast({
        title: "Upload concluído!",
        description: "A imagem foi enviada com sucesso.",
      })
    } catch (error: any) {
      setError(error.message || "Erro ao fazer upload da imagem")
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Não foi possível fazer upload da imagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setUploadingFile(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Salvando produto:", formData)

      if (!formData.name?.trim()) throw new Error("O nome do produto é obrigatório")
      if (!formData.description?.trim()) throw new Error("A descrição é obrigatória")
      if (!formData.price || Number.parseFloat(formData.price) <= 0) throw new Error("O preço deve ser maior que zero")
      if (!formData.category_id) throw new Error("Selecione uma categoria")
      if (!formData.image_url?.trim()) throw new Error("Adicione uma imagem do produto")

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number.parseFloat(formData.price),
        image_url: formData.image_url.trim(),
        affiliate_link: formData.affiliate_link?.trim() || null,
        category_id: formData.category_id,
      }

      console.log("[v0] Dados do produto:", productData)

      let result
      if (product) {
        console.log("[v0] Atualizando produto:", product.id)
        result = await supabase.from("products").update(productData).eq("id", product.id).select()
      } else {
        console.log("[v0] Criando novo produto")
        result = await supabase.from("products").insert([productData]).select()
      }

      if (result.error) {
        console.error("[v0] Erro do Supabase:", result.error)
        throw new Error(result.error.message || "Erro ao salvar produto")
      }

      console.log("[v0] Produto salvo com sucesso!", result.data)

      toast({
        title: product ? "Produto atualizado!" : "Produto criado!",
        description: "As alterações foram salvas com sucesso.",
      })

      router.push("/admin/produtos")
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Erro ao salvar produto:", error)
      setError(error.message || "Erro ao salvar produto")
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o produto. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900/80 border-purple-500/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Nome do Produto *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-gray-800/50 border-purple-500/30 text-white"
              placeholder="Exemplo: Smartphone Galaxy Pro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Descrição *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="bg-gray-800/50 border-purple-500/30 text-white resize-none"
              placeholder="Descreva o produto..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-white">
                Preço (R$) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="bg-gray-800/50 border-purple-500/30 text-white"
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id" className="text-white">
                Categoria *
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                required
              >
                <SelectTrigger className="bg-gray-800/50 border-purple-500/30 text-white">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="text-white hover:bg-purple-500/20">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Imagem do Produto *</Label>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                <TabsTrigger value="url" className="data-[state=active]:bg-purple-600">
                  <Link2 className="w-4 h-4 mr-2" />
                  URL da Imagem
                </TabsTrigger>
                <TabsTrigger value="upload" className="data-[state=active]:bg-pink-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload de Arquivo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2">
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-gray-800/50 border-purple-500/30 text-white"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </TabsContent>

              <TabsContent value="upload" className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="file_upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    className="bg-gray-800/50 border-purple-500/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  {uploadingFile && <span className="text-purple-400 text-sm animate-pulse">Enviando...</span>}
                </div>
                <p className="text-white/40 text-xs">Formatos: JPG, PNG, GIF. Tamanho máximo: 5MB</p>
              </TabsContent>
            </Tabs>

            {formData.image_url && (
              <div className="mt-2 relative h-48 w-full rounded-lg overflow-hidden border border-purple-500/30">
                <Image
                  src={formData.image_url || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={() => setError("URL da imagem inválida")}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliate_link" className="text-white">
              Link do Produto (Afiliado)
            </Label>
            <Input
              id="affiliate_link"
              type="url"
              value={formData.affiliate_link}
              onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
              className="bg-gray-800/50 border-purple-500/30 text-white"
              placeholder="https://shopee.com.br/..."
            />
            <p className="text-white/40 text-xs">
              Link para onde o cliente será redirecionado ao clicar em "Ver Oferta"
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Salvando..." : product ? "Atualizar Produto" : "Criar Produto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
