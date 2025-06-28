import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FiltrosImoveis } from "@/types/imovel"


interface FiltrosImoveisProps {
    filtros: FiltrosImoveis
    onFiltrosChange: (filtros: FiltrosImoveis) => void
    onLimparFiltros: () => void
    disabled?: boolean
  }
  
  export function FiltrosImoveisComponent({ filtros, onFiltrosChange, onLimparFiltros, disabled }: FiltrosImoveisProps) {
    const handleFiltroChange = (campo: keyof FiltrosImoveis, valor: string) => {
      onFiltrosChange({ ...filtros, [campo]: valor })
    }
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="finalidade">Finalidade</Label>
            <Select value={filtros.finalidade} onValueChange={(value) => handleFiltroChange("finalidade", value)} disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="venda">Venda</SelectItem>
                <SelectItem value="Locação">Locação</SelectItem>
              </SelectContent>
            </Select>
          </div>
  
          <div>
            <Label htmlFor="valorMinimo">Valor Mínimo (R$)</Label>
            <Input
              id="valorMinimo"
              type="number"
              step="0.01"
              value={filtros.valorMinimo}
              onChange={(e) => handleFiltroChange("valorMinimo", e.target.value)}
              placeholder="0,00"
              disabled={disabled}
            />
          </div>
  
          <div>
            <Label htmlFor="valorMaximo">Valor Máximo (R$)</Label>
            <Input
              id="valorMaximo"
              type="number"
              step="0.01"
              value={filtros.valorMaximo}
              onChange={(e) => handleFiltroChange("valorMaximo", e.target.value)}
              placeholder="0,00"
              disabled={disabled}
            />
          </div>
  
          <Button onClick={onLimparFiltros} variant="outline" className="w-full bg-transparent" disabled={disabled}>
            Limpar Filtros
          </Button>
        </CardContent>
      </Card>
    )
  }
  
