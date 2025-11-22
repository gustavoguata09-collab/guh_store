"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { Home, Grid, ShoppingBag, Phone } from "lucide-react"
import Image from "next/image"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/categorias", label: "Categorias", icon: Grid },
    { href: "/produtos", label: "Produtos", icon: ShoppingBag },
    { href: "/contato", label: "Contato", icon: Phone },
  ]

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-black via-gray-900 to-black border-b border-pink-500/20 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 relative hover:scale-110 transition-transform">
              <Image
                src="/imagens/logo.png"
                alt="Loja do Guh Logo"
                width={48}
                height={48}
                className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] rounded-full"
                priority
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text">
              Loja do Guh
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/80 transition-colors hover:text-pink-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-black border-l border-white/20">
                <div className="flex flex-col h-full">
                  <div className="py-6 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-center text-white">Menu</h2>
                  </div>

                  <nav className="flex-1 py-6">
                    <div className="space-y-2">
                      {menuItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group"
                          >
                            <Icon className="w-5 h-5 text-white/90 group-hover:text-white" />
                            <span className="text-base font-medium text-white/90 group-hover:text-white">
                              {item.label}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
