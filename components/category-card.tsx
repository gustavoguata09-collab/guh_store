import Link from 'next/link'
import { Card } from '@/components/ui/card'
import type { Category } from '@/lib/types'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categorias/${category.slug}`}>
      <Card 
        className="group p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
        style={{ 
          borderTopColor: category.color || undefined,
          borderTopWidth: '3px'
        }}
      >
        <div className="space-y-2 sm:space-y-3">
          {category.icon && (
            <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
          )}
          <h3 className="font-semibold text-sm sm:text-base lg:text-lg line-clamp-2">{category.name}</h3>
          {category.description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 hidden sm:block">
              {category.description}
            </p>
          )}
        </div>
      </Card>
    </Link>
  )
}
