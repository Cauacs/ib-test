import { MapPin, Bed, Bath, Car, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Imovel } from "@/types/imovel"


interface ImovelCardProps {
    imovel: Imovel
    onEdit: (imovel: Imovel) => void
    onDelete: (id: string) => void
    onView: (imovel: Imovel) => void
  }
  
  export function ImovelCard({ imovel, onEdit, onDelete, onView }: ImovelCardProps) {
    const formatarValor = (valor: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor)
    }
  
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg line-clamp-2">{imovel.titulo}</CardTitle>
            <Badge variant={imovel.finalidade === "Venda" ? "default" : "secondary"}>{imovel.finalidade}</Badge>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{imovel.endereco}</span>
          </div>
        </CardHeader>
  
        <CardContent className="flex-1 flex flex-col">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{imovel.descricao}</p>
  
          <div className="space-y-3">
            <div className="text-2xl font-bold text-primary">
              {formatarValor(imovel.valor)}
              {imovel.finalidade === "Locação" && <span className="text-sm font-normal">/mês</span>}
            </div>
  
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{imovel.quartos}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{imovel.banheiros}</span>
              </div>
              {imovel.garagem && (
                <div className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  <span>Garagem</span>
                </div>
              )}
            </div>
  
            <div className="text-sm">
              <span className="text-muted-foreground">Corretor: </span>
              <span className="font-medium">{imovel.corretor}</span>
            </div>
  
            <div className="flex gap-2 pt-2">
              <Button onClick={() => onView(imovel)} variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-1" />
                Ver
              </Button>
              <Button onClick={() => onEdit(imovel)} variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button onClick={() => onDelete(imovel.id)} variant="destructive" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  