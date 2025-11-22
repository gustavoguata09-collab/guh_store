"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Verifica as credenciais contra as variáveis de ambiente
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@guhstore.com"
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

      if (email === adminEmail && password === adminPassword) {
        // Salva no sessionStorage para manter a sessão
        sessionStorage.setItem("admin_auth", "true")
        router.push("/admin")
        router.refresh()
      } else {
        throw new Error("Email ou senha incorretos")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-lg border-purple-500/30">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-24 h-24 relative">
            <Image src="/imagens/logo.png" alt="Logo Guh Store" fill className="object-contain rounded-full" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text">
              Painel Admin
            </CardTitle>
            <CardDescription className="text-white/60 mt-2">Entre com suas credenciais</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@guhstore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800/50 border-purple-500/30 text-white placeholder:text-white/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800/50 border-purple-500/30 text-white placeholder:text-white/40"
              />
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              {isLoading ? "Entrando..." : "Entrar no Painel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
