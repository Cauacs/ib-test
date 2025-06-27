import { createContext, useContext, useState, type ReactNode } from "react"
import type { Imovel } from "@/types/imovel"

interface ImoveisContextType {
  imoveis: Imovel[]
  adicionarImovel: (imovel: Omit<Imovel, "id" | "createdAt">) => void
  editarImovel: (id: string, imovel: Omit<Imovel, "id" | "createdAt">) => void
  excluirImovel: (id: string) => void
  obterImovel: (id: string) => Imovel | undefined
}

const ImoveisContext = createContext<ImoveisContextType | undefined>(undefined)

// Dados mockados
const imoveisMock: Imovel[] = [
  {
    id: "1",
    titulo: "Apartamento Moderno no Centro",
    descricao: "Lindo apartamento com vista para a cidade, totalmente mobiliado e em excelente localização.",
    endereco: "Rua das Flores, 123 - Centro, São Paulo - SP",
    finalidade: "Venda",
    valor: 450000,
    quartos: 2,
    banheiros: 2,
    garagem: true,
    corretor: "Maria Silva",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    titulo: "Casa Familiar em Condomínio",
    descricao: "Casa espaçosa em condomínio fechado, ideal para famílias. Área de lazer completa.",
    endereco: "Rua dos Ipês, 456 - Jardim América, São Paulo - SP",
    finalidade: "Locacao",
    valor: 3500,
    quartos: 3,
    banheiros: 3,
    garagem: true,
    corretor: "João Santos",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    titulo: "Studio Compacto",
    descricao: "Studio moderno e funcional, perfeito para jovens profissionais. Próximo ao metrô.",
    endereco: "Av. Paulista, 789 - Bela Vista, São Paulo - SP",
    finalidade: "Locacao",
    valor: 2200,
    quartos: 1,
    banheiros: 1,
    garagem: false,
    corretor: "Ana Costa",
    createdAt: new Date("2024-03-05"),
  },
  {
    id: "4",
    titulo: "Cobertura de Luxo",
    descricao: "Cobertura duplex com terraço gourmet e vista panorâmica da cidade.",
    endereco: "Rua Augusta, 321 - Consolação, São Paulo - SP",
    finalidade: "Venda",
    valor: 1200000,
    quartos: 4,
    banheiros: 4,
    garagem: true,
    corretor: "Carlos Oliveira",
    createdAt: new Date("2024-01-20"),
  },
]

export function ImoveisProvider({ children }: { children: ReactNode }) {
  const [imoveis, setImoveis] = useState<Imovel[]>(imoveisMock)

  const adicionarImovel = (novoImovel: Omit<Imovel, "id" | "createdAt">) => {
    const imovel: Imovel = {
      ...novoImovel,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setImoveis((prev) => [...prev, imovel])
  }

  const editarImovel = (id: string, imovelAtualizado: Omit<Imovel, "id" | "createdAt">) => {
    setImoveis((prev) =>
      prev.map((imovel) => (imovel.id === id ? { ...imovelAtualizado, id, createdAt: imovel.createdAt } : imovel)),
    )
  }

  const excluirImovel = (id: string) => {
    setImoveis((prev) => prev.filter((imovel) => imovel.id !== id))
  }

  const obterImovel = (id: string) => {
    return imoveis.find((imovel) => imovel.id === id)
  }

  return (
    <ImoveisContext.Provider
      value={{
        imoveis,
        adicionarImovel,
        editarImovel,
        excluirImovel,
        obterImovel,
      }}
    >
      {children}
    </ImoveisContext.Provider>
  )
}

export function useImoveis() {
  const context = useContext(ImoveisContext)
  if (context === undefined) {
    throw new Error("useImoveis deve ser usado dentro de um ImoveisProvider")
  }
  return context
}
