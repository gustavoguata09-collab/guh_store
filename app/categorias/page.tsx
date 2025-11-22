import { getSupabaseServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  Sparkles,
  BookOpen,
  Package,
  ShoppingBag,
  Watch,
  Laptop,
  Zap,
  Heart,
  Coffee,
  Camera,
  Headphones,
  Gamepad2,
  Palette,
  Flower2,
} from "lucide-react"
import type { Category } from "@/lib/types"

const iconMap: Record<string, any> = {
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  Sparkles,
  BookOpen,
  Package,
  ShoppingBag,
  Watch,
  Laptop,
  Zap,
  Heart,
  Coffee,
  Camera,
  Headphones,
  Gamepad2,
  Palette,
  Flower2,
}

const colorMap: Record<string, string> = {
  Smartphone: "from-blue-500 to-cyan-500",
  Shirt: "from-pink-500 to-rose-500",
  Home: "from-orange-500 to-amber-500",
  Dumbbell: "from-green-500 to-emerald-500",
  Sparkles: "from-purple-500 to-pink-500",
  BookOpen: "from-indigo-500 to-blue-500",
  Package: "from-pink-500 to-purple-500",
  ShoppingBag: "from-red-500 to-pink-500",
  Watch: "from-gray-700 to-gray-900",
  Laptop: "from-violet-500 to-purple-500",
  Zap: "from-yellow-500 to-orange-500",
  Heart: "from-red-500 to-rose-500",
  Coffee: "from-amber-700 to-orange-600",
  Camera: "from-teal-500 to-cyan-500",
  Headphones: "from-fuchsia-500 to-pink-500",
  Gamepad2: "from-indigo-600 to-purple-600",
  Palette: "from-pink-400 to-orange-400",
  Flower2: "from-pink-400 to-rose-400",
}

export default async function CategoriasPage() {
  const supabase = await getSupabaseServerClient()

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <h1 className="font-bold text-balance text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text animate-slide-down">
            Categorias
          </h1>
          <p className="text-pretty text-sm sm:text-base text-gray-400 px-4 animate-fade-in animation-delay-200">
            Escolha uma categoria para ver os produtos
          </p>
        </div>

        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((category: Category, index: number) => {
              const IconComponent = iconMap[category.icon || "Package"] || Package
              const gradientColor = colorMap[category.icon || "Package"] || "from-pink-500 to-purple-600"

              return (
                <Link
                  key={category.id}
                  href={`/categorias/${category.slug}`}
                  className={`group flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/20 border border-pink-500/20 animate-scale-in animation-delay-${((index % 6) + 1) * 100}`}
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-center text-sm sm:text-base text-balance text-white">
                    {category.name}
                  </h3>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhuma categoria disponível no momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}
