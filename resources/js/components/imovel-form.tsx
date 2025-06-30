import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { Imovel, ImovelFormData } from '@/types/imovel';

interface ImovelFormProps {
    imovel?: Imovel;
    onSubmit: (data: ImovelFormData) => void;
    onCancel: () => void;
    isEditing?: boolean;
}


export function ImovelForm({ imovel, onSubmit, onCancel, isEditing = false }: ImovelFormProps) {
    const [formData, setFormData] = useState<ImovelFormData>({
      titulo: imovel?.titulo || "",
      descricao: imovel?.descricao || "",
      endereco: imovel?.endereco || "",
      finalidade: imovel?.finalidade || "Venda",
      valor: imovel?.valor?.toString() || "",
      quartos: imovel?.quartos?.toString() || "",
      banheiros: imovel?.banheiros?.toString() || "",
      garagem: imovel?.garagem || false,
      corretor: imovel?.corretor || "",
    })
  
    const [errors, setErrors] = useState<Partial<ImovelFormData>>({})
  
    const validateForm = (): boolean => {
      const newErrors: Partial<ImovelFormData> = {}
  
      if (!formData.titulo.trim()) {
        newErrors.titulo = "Título é obrigatório"
      }
  
      if (!formData.descricao.trim()) {
        newErrors.descricao = "Descrição é obrigatória"
      }
  
      if (!formData.endereco.trim()) {
        newErrors.endereco = "Endereço é obrigatório"
      }
  
      if (!formData.valor || Number.parseFloat(formData.valor) <= 0) {
        newErrors.valor = "Valor deve ser maior que zero"
      }
  
      if (!formData.quartos || Number.parseInt(formData.quartos) <= 0) {
        newErrors.quartos = "Quantidade de quartos deve ser maior que zero"
      }
  
      if (!formData.banheiros || Number.parseInt(formData.banheiros) <= 0) {
        newErrors.banheiros = "Quantidade de banheiros deve ser maior que zero"
      }
  
      if (!formData.corretor.trim()) {
        newErrors.corretor = "Nome do corretor é obrigatório"
      }
  
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (validateForm()) {
        onSubmit(formData)
      }
    }
  
    const handleInputChange = (field: keyof ImovelFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }
  
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Imóvel" : "Cadastrar Novo Imóvel"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  className={errors.titulo ? "border-red-500" : ""}
                />
                {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
              </div>
  
              <div className="md:col-span-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  className={errors.descricao ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
              </div>
  
              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço Completo *</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange("endereco", e.target.value)}
                  className={errors.endereco ? "border-red-500" : ""}
                />
                {errors.endereco && <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>}
              </div>
  
              <div>
                <Label htmlFor="finalidade">Finalidade *</Label>
                <Select
                  value={formData.finalidade}
                  onValueChange={(value: "Venda" | "Locação") => handleInputChange("finalidade", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Venda">Venda</SelectItem>
                    <SelectItem value="Locação">Locação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
  
              <div>
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => handleInputChange("valor", e.target.value)}
                  className={errors.valor ? "border-red-500" : ""}
                />
                {errors.valor && <p className="text-red-500 text-sm mt-1">{errors.valor}</p>}
              </div>
  
              <div>
                <Label htmlFor="quartos">Quartos *</Label>
                <Input
                  id="quartos"
                  type="number"
                  min="1"
                  value={formData.quartos}
                  onChange={(e) => handleInputChange("quartos", e.target.value)}
                  className={errors.quartos ? "border-red-500" : ""}
                />
                {errors.quartos && <p className="text-red-500 text-sm mt-1">{errors.quartos}</p>}
              </div>
  
              <div>
                <Label htmlFor="banheiros">Banheiros *</Label>
                <Input
                  id="banheiros"
                  type="number"
                  min="1"
                  value={formData.banheiros}
                  onChange={(e) => handleInputChange("banheiros", e.target.value)}
                  className={errors.banheiros ? "border-red-500" : ""}
                />
                {errors.banheiros && <p className="text-red-500 text-sm mt-1">{errors.banheiros}</p>}
              </div>
  
              <div className="md:col-span-2">
                <Label htmlFor="corretor">Nome do Corretor *</Label>
                <Input
                  id="corretor"
                  value={formData.corretor}
                  onChange={(e) => handleInputChange("corretor", e.target.value)}
                  className={errors.corretor ? "border-red-500" : ""}
                />
                {errors.corretor && <p className="text-red-500 text-sm mt-1">{errors.corretor}</p>}
              </div>
  
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="garagem"
                    checked={formData.garagem}
                    onCheckedChange={(checked) => handleInputChange("garagem", checked as boolean)}
                  />
                  <Label htmlFor="garagem">Possui Garagem</Label>
                </div>
              </div>
            </div>
  
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {isEditing ? "Salvar Alterações" : "Cadastrar Imóvel"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }
  