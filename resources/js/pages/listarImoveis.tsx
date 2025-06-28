import * as imovelService from "@/services/imovelService"

import { useEffect, useState } from "react"
import { Plus, X, CheckCircle, XCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImovelForm } from "@/components/imovel-form"
import { ImovelCard } from "@/components/imovel-card"
import { ImovelDetalhes } from "@/components/imovel-detalhes"
import { FiltrosImoveisComponent } from "@/components/filtro-imoveis"
import type { Imovel, ImovelFormData, FiltrosImoveis } from "@/types/imovel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ViewMode = "list" | "create" | "edit"

interface Notification {
  id: string
  type: "success" | "error" | "info"
  message: string
}
// Componente de Notificações
function Notifications({
  notifications,
  onRemove,
}: {
  notifications: Notification[]
  onRemove: (id: string) => void
}) {
  if (notifications.length === 0) return null

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBackgroundColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "info":
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-md ${getBackgroundColor(notification.type)}`}
        >
          {getIcon(notification.type)}
          <p className="flex-1 text-sm font-medium">{notification.message}</p>
          <Button variant="ghost" size="sm" onClick={() => onRemove(notification.id)} className="h-6 w-6 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export default function ImoveisPage() {
  // Estados principais
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [imovelSelecionado, setImovelSelecionado] = useState<Imovel | null>(null)
  const [imovelDetalhes, setImovelDetalhes] = useState<Imovel | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [imovelParaExcluir, setImovelParaExcluir] = useState<string | null>(null)
  const [termoBusca, setTermoBusca] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>([])

  const [filtros, setFiltros] = useState<FiltrosImoveis>({
    finalidade: "",
    valorMinimo: "",
    valorMaximo: "",
  })

  //Carregar imoveis on mount

  useEffect(()=> {
    const fetchImoveis = async () => {
      try{
        const dados = await imovelService.fetchImoveis();
        setImoveis(dados);
      } catch(err){
        addNotification("error", "Falha ao carregar imóveis");
      }
    }

    fetchImoveis();
  }, [])

  // Funções de notificação
  const addNotification = (type: Notification["type"], message: string) => {
    const id = Date.now().toString()
    const notification: Notification = { id, type, message }

    setNotifications((prev) => [...prev, notification])

    // Remove a notificação após 5 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Funções CRUD

  const adicionarImovel = async (novoImovel: Omit<Imovel, "id" | "createdAt">) => {
    try{
      const imovel = await imovelService.createImovel(novoImovel);
      setImoveis((prev) => [...prev, imovel]);
      return imovel;
    }
    catch(err) {
      addNotification("error", "Falha ao criar imóvel")
      console.log(err)
      throw new Error("Falha ao criar imóvel")
    }
  }
  const editarImovel = async (id: string, imovelAtualizado: Omit<Imovel, "id" | "createdAt">) => {
    try{
      const editedImovel = await imovelService.updateImovel(id, imovelAtualizado);
      setImoveis((prev) => 
        prev.map((imovel) => (imovel.id === id ? {...editedImovel, id, createdAt: imovel.createdAt} : imovel))
      )      
      return editedImovel;
    }
    catch(err) {
      addNotification("error", "Falha ao atualizar imóvel")
      console.log(err)
    }
    
  }

  const excluirImovel = async (id: string) => {
    try{
      await imovelService.deleteImovel(id)
      setImoveis((prev) => prev.filter((imovel) => imovel.id !== id))
      addNotification("success", "Imóvel excluido")
    }
    catch(err){
      addNotification("error", "Falha ao excluir imóvel")
      console.log(err)
    }
  }

  const obterImovel = async (id: string) => {
    try{
      const imovel = await imovelService.fetchImovel(id);
      return imovel
    }
    catch(err){
      addNotification("error", "Falha em buscar imóvel com id: " + id);
      console.log(err)
    }
  }

  // Função de filtros
  const filtrarImoveis = () => {
    return imoveis.filter((imovel) => {
      // Filtro por termo de busca
      const matchBusca =
        !termoBusca ||
        imovel.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        imovel.endereco.toLowerCase().includes(termoBusca.toLowerCase()) ||
        imovel.corretor.toLowerCase().includes(termoBusca.toLowerCase())

      // Filtro por finalidade
      const matchFinalidade = filtros.finalidade.toLowerCase() === "todas"||!filtros.finalidade || imovel.finalidade.toLowerCase() === filtros.finalidade.toLowerCase()
      // Filtro por valor mínimo
      const matchValorMinimo = !filtros.valorMinimo || imovel.valor >= Number.parseFloat(filtros.valorMinimo)
      // Filtro por valor máximo
      const matchValorMaximo = !filtros.valorMaximo || imovel.valor <= Number.parseFloat(filtros.valorMaximo)

      return matchBusca && matchFinalidade && matchValorMinimo && matchValorMaximo
    })
  }

  // Handlers
  const handleSubmitForm = async (data: ImovelFormData) => {
    try {
      const imovelData = {
        titulo: data.titulo,
        descricao: data.descricao,
        endereco: data.endereco,
        finalidade: data.finalidade,
        valor: Number.parseFloat(data.valor),
        quartos: Number.parseInt(data.quartos),
        banheiros: Number.parseInt(data.banheiros),
        garagem: data.garagem,
        corretor: data.corretor,
      }

      if (viewMode === "edit" && imovelSelecionado) {
        await editarImovel(imovelSelecionado.id, imovelData)
        addNotification("success", "Imóvel editado com sucesso!")
      } else {
        await adicionarImovel(imovelData)
        addNotification("success", "Imóvel cadastrado com sucesso!")
      }

      setViewMode("list")
      setImovelSelecionado(null)
    } catch (error) {
      addNotification("error", "Erro ao salvar imóvel. Tente novamente.")
    }
  }

  const handleEditImovel = (imovel: Imovel) => {
    setImovelSelecionado(imovel)
    setViewMode("edit")
  }

  const handleDeleteImovel = (id: string) => {
    setImovelParaExcluir(id)
    setShowDeleteDialog(true)
  }

  const confirmarExclusao = () => {
    if (imovelParaExcluir) {
      excluirImovel(imovelParaExcluir)
      addNotification("success", "Imóvel excluído com sucesso!")
      setImovelParaExcluir(null)
      setShowDeleteDialog(false)
    }
  }

  const handleViewImovel = (imovel: Imovel) => {
    setImovelDetalhes(imovel)
  }

  const limparFiltros = () => {
    setFiltros({
      finalidade: "",
      valorMinimo: "",
      valorMaximo: "",
    })
    setTermoBusca("")
  }

  const imoveisFiltrados = filtrarImoveis()

  // Renderização condicional para formulário
  if (viewMode === "create" || viewMode === "edit") {
    return (
      <div className="container mx-auto px-4 py-8">
        <ImovelForm
          imovel={imovelSelecionado || undefined}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setViewMode("list")
            setImovelSelecionado(null)
          }}
          isEditing={viewMode === "edit"}
        />
        <Notifications notifications={notifications} onRemove={removeNotification} />
      </div>
    )
  }

  // Renderização principal
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Plus className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Imóveis</h1>
              <p className="text-muted-foreground">Gerencie seus imóveis para venda e locação</p>
            </div>
          </div>
          <Button onClick={() => setViewMode("create")} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Imóvel
          </Button>
        </div>

        {/* Busca e Filtros */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Input
              placeholder="Buscar por título, endereço ou corretor..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="lg:col-span-1">
            <FiltrosImoveisComponent filtros={filtros} onFiltrosChange={setFiltros} onLimparFiltros={limparFiltros} />
          </div>
        </div>

        {/* Lista de Imóveis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            {imoveisFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <Plus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum imóvel encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {imoveis.length === 0
                    ? "Comece cadastrando seu primeiro imóvel."
                    : "Tente ajustar os filtros de busca."}
                </p>
                {imoveis.length === 0 && (
                  <Button onClick={() => setViewMode("create")} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Cadastrar Primeiro Imóvel
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">
                    {imoveisFiltrados.length}{" "}
                    {imoveisFiltrados.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {imoveisFiltrados.map((imovel) => (
                    <ImovelCard
                      key={imovel.id}
                      imovel={imovel}
                      onEdit={handleEditImovel}
                      onDelete={handleDeleteImovel}
                      onView={handleViewImovel}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <ImovelDetalhes imovel={imovelDetalhes} open={!!imovelDetalhes} onClose={() => setImovelDetalhes(null)} />

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarExclusao}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notificações */}
      <Notifications notifications={notifications} onRemove={removeNotification} />
    </div>
  )
}
