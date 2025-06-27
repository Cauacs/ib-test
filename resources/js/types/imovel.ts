export interface Imovel {
    id: string
    titulo: string
    descricao: string
    endereco: string
    finalidade: "Venda" | "Locacao"
    valor: number
    quartos: number
    banheiros: number
    garagem: boolean
    corretor: string
    createdAt: Date
  }
  
  export interface ImovelFormData {
    titulo: string
    descricao: string
    endereco: string
    finalidade: "Venda" | "Locacao"
    valor: string
    quartos: string
    banheiros: string
    garagem: boolean
    corretor: string
  }
  
  export interface FiltrosImoveis {
    finalidade: string
    valorMinimo: string
    valorMaximo: string
  }
  