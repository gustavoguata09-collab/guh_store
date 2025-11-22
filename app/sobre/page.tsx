import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      {/* ========================================
          SEÇÃO 1: BANNER TOPO
          ======================================== */}
      {/* 
        EDITE AQUI:
        - Título da página
        - Descrição
      */}
      <section className="relative bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* TÍTULO - Edite o texto abaixo */}
            <h1 className="font-bold text-balance text-5xl text-purple-600">Sobre</h1>

            {/* DESCRIÇÃO - Edite o texto abaixo */}
            <p className="text-pretty text-lg text-purple-400 leading-relaxed">
              Conheça a história da Guh Store e nosso compromisso com você
            </p>
          </div>
        </div>
      </section>

      {/* ========================================
          SEÇÃO 2: SOBRE A AFILIADA
          ======================================== */}
      {/* 
        EDITE AQUI:
        - Nome da afiliada
        - Foto (src="/professional-woman-smiling.png")
        - História/biografia (3 parágrafos)
      */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 space-y-8">
              <div className="space-y-6">
                <h2 className="font-bold text-balance text-3xl">Bem-vindo à Guh Store!</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    A Guh Store nasceu com uma missão simples: conectar você aos melhores produtos do mercado com total
                    transparência e confiança. Somos uma loja de afiliados que seleciona cuidadosamente cada item para
                    garantir qualidade e satisfação.
                  </p>
                  <p>
                    Trabalhamos com as principais plataformas e marcas do Brasil, oferecendo produtos em diversas
                    categorias: eletrônicos, moda, casa e decoração, beleza, esportes e muito mais. Cada produto é
                    avaliado antes de ser incluído em nossa loja.
                  </p>
                  <p>
                    Nossa equipe está sempre em busca das melhores ofertas, promoções exclusivas e lançamentos para você
                    ter acesso aos produtos mais desejados do momento com os melhores preços do mercado.
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================
                SEÇÃO 3: VALORES (3 CARDS)
                ======================================== */}
            {/* 
              EDITE AQUI:
              - Títulos dos valores
              - Descrições dos valores
              - Cores dos ícones (bg-pink-100, bg-purple-100, bg-indigo-100)
            */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {/* VALOR 1: QUALIDADE */}
              <Card className="p-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                {/* TÍTULO - Edite abaixo */}
                <h3 className="font-bold text-xl">Qualidade</h3>
                {/* DESCRIÇÃO - Edite abaixo */}
                <p className="text-sm text-muted-foreground">Produtos cuidadosamente selecionados e testados</p>
              </Card>

              {/* VALOR 2: MELHOR PREÇO */}
              <Card className="p-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                {/* TÍTULO - Edite abaixo */}
                <h3 className="font-bold text-xl">Melhor Preço</h3>
                {/* DESCRIÇÃO - Edite abaixo */}
                <p className="text-sm text-muted-foreground">Sempre buscando as melhores ofertas do mercado</p>
              </Card>

              {/* VALOR 3: CONFIANÇA */}
              <Card className="p-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                {/* TÍTULO - Edite abaixo */}
                <h3 className="font-bold text-xl">Confiança</h3>
                {/* DESCRIÇÃO - Edite abaixo */}
                <p className="text-sm text-muted-foreground">Transparência total em cada recomendação</p>
              </Card>
            </div>

            {/* ========================================
                SEÇÃO 4: CALL TO ACTION
                ======================================== */}
            {/* 
              EDITE AQUI:
              - Título do CTA
              - Descrição
              - Textos dos botões
            */}
            <Card className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white p-8 lg:p-12 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* TÍTULO - Edite o texto abaixo */}
                <h2 className="font-bold text-balance text-3xl">Pronto para descobrir produtos incríveis?</h2>

                {/* DESCRIÇÃO - Edite o texto abaixo */}
                <p className="text-pretty text-lg opacity-90">
                  Explore nossa seleção e encontre exatamente o que você procura com segurança e qualidade
                </p>

                {/* BOTÕES - Edite os textos abaixo */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/produtos">Ver Produtos</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                  >
                    <Link href="/contato">Entre em Contato</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
