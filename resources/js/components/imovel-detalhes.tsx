import { MapPin, Bed, Bath, Car, Calendar, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Imovel } from "@/types/imovel"

interface ImovelDetalhesProps {
    imovel: Imovel | null
    open: boolean
    onClose: () => void
  }
  
  export function ImovelDetalhes({ imovel, open, onClose }: ImovelDetalhesProps) {
    if (!imovel) return null
  
    const formatarValor = (valor: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor)
    }
  
    const formatarData = (data: Date) => {
      return new Intl.DateTimeFormat("pt-BR").format(data)
    }
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start gap-4">
              <DialogTitle className="text-xl">{imovel.titulo}</DialogTitle>
              <Badge variant={imovel.finalidade === "Venda" ? "default" : "secondary"}>{imovel.finalidade}</Badge>
            </div>
          </DialogHeader>
  
          <div className="space-y-6">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{imovel.endereco}</span>
            </div>
  
            <div className="text-3xl font-bold text-primary">
              {formatarValor(imovel.valor)}
              {imovel.finalidade === "Locacao" && <span className="text-lg font-normal">/mês</span>}
            </div>
  
            <Separator />
  
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">{imovel.descricao}</p>
            </div>
  
            <Separator />
  
            <div>
              <h3 className="font-semibold mb-4">Características</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{imovel.quartos}</div>
                    <div className="text-sm text-muted-foreground">{imovel.quartos === 1 ? "Quarto" : "Quartos"}</div>
                  </div>
                </div>
  
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{imovel.banheiros}</div>
                    <div className="text-sm text-muted-foreground">
                      {imovel.banheiros === 1 ? "Banheiro" : "Banheiros"}
                    </div>
                  </div>
                </div>
  
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{imovel.garagem ? "Sim" : "Não"}</div>
                    <div className="text-sm text-muted-foreground">Garagem</div>
                  </div>
                </div>
              </div>
            </div>
  
            <Separator />
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{imovel.corretor}</div>
                  <div className="text-sm text-muted-foreground">Corretor Responsável</div>
                </div>
              </div>
  
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{formatarData(imovel.createdAt)}</div>
                  <div className="text-sm text-muted-foreground">Data de Cadastro</div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  