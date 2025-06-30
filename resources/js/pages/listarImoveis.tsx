import * as imovelService from '@/services/imovelService';
import { Notifications, type Notification } from '@/components/notifications';
import { FiltrosImoveisComponent } from '@/components/filtro-imoveis';
import { ImovelCard } from '@/components/imovel-card';
import { ImovelDetalhes } from '@/components/imovel-detalhes';
import { ImovelForm } from '@/components/imovel-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { FiltrosImoveis, Imovel, ImovelFormData } from '@/types/imovel';
import { CheckCircle, Info, Plus, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type ViewMode = 'list' | 'create' | 'edit';



export default function ImoveisPage() {
  // Estados principais
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [imovelSelecionado, setImovelSelecionado] = useState<Imovel | null>(null);
  const [imovelDetalhes, setImovelDetalhes] = useState<Imovel | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imovelParaExcluir, setImovelParaExcluir] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [operationLoading, setOperationloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)

  const [filtros, setFiltros] = useState<FiltrosImoveis>({
    finalidade: '',
    valorMinimo: '',
    valorMaximo: '',
  });

  //Carregar imoveis on mount

  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        setLoading(true)
        setError(null)
        const dados = await imovelService.fetchImoveis();
        setImoveis(dados);

      } catch (err) {
        console.error("Erro ao carregar imóveis: ", err)
        setError("Falha ao carregar ímoveis.")
        addNotification('error', 'Falha ao carregar imóveis');

      } finally {
        setLoading(false)
      }
    };

    fetchImoveis();
  }, []);

  // Funções de notificação
  const addNotification = (type: Notification['type'], message: string) => {
    const id = Date.now().toString();
    const notification: Notification = { id, type, message };

    setNotifications((prev) => [...prev, notification]);

    // Remove a notificação após 5 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Funções CRUD

  const adicionarImovel = async (novoImovel: Omit<Imovel, 'id' | 'createdAt'>) => {
    try {
      setOperationloading(true)
      const imovel = await imovelService.createImovel(novoImovel);
      setImoveis((prev) => [...prev, imovel]);
      return imovel;

    } catch (err) {
      console.error("Erro ao criar ímovel", err)
      addNotification('error', 'Falha ao criar imóvel');
      throw err;
    }
    finally {
      setOperationloading(false)
    }
  };

  const editarImovel = async (id: string, imovelAtualizado: Omit<Imovel, 'id' | 'createdAt'>) => {
    try {
      setOperationloading(true)
      const editedImovel = await imovelService.updateImovel(id, imovelAtualizado);
      setImoveis((prev) => prev.map((imovel) => (imovel.id === id ? { ...editedImovel, id, createdAt: imovel.createdAt } : imovel)));
      return editedImovel;
    } catch (err) {
      console.error("Erro ao atualizar imóvel", err)
      addNotification('error', 'Falha ao atualizar imóvel');
      throw err
    } finally {
      setOperationloading(false)
    }

  };

  const excluirImovel = async (id: string) => {
    try {
      setOperationloading(true)
      await imovelService.deleteImovel(id);
      setImoveis((prev) => prev.filter((imovel) => imovel.id !== id));
      addNotification('success', 'Imóvel excluido');
    } catch (err) {
      console.error("Erro ao excluir imóvel: ", err)
      throw err
    } finally {
      setOperationloading(false)
    }
  };

  const obterImovel = async (id: string) => {
    try {
      setOperationloading(true)
      const imovel = await imovelService.fetchImovel(id);
      return imovel;
    } catch (err) {
      console.error("Erro ao buscar por imóvel com id: " + id, err)
      addNotification('error', 'Erro em buscar imóvel');
      throw err
    } finally {
      setOperationloading(false)
    }
  };

  // Função de filtros
  const filtrarImoveis = () => {
    return imoveis.filter((imovel) => {
      // Filtro por termo de busca
      const matchBusca =
        !termoBusca ||
        imovel.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        imovel.endereco.toLowerCase().includes(termoBusca.toLowerCase()) ||
        imovel.corretor.toLowerCase().includes(termoBusca.toLowerCase());

      // Filtro por finalidade
      const matchFinalidade =
        filtros.finalidade.toLowerCase() === 'todas' ||
        !filtros.finalidade ||
        imovel.finalidade.toLowerCase() === filtros.finalidade.toLowerCase();
      // Filtro por valor mínimo
      const matchValorMinimo = !filtros.valorMinimo || imovel.valor >= Number.parseFloat(filtros.valorMinimo);
      // Filtro por valor máximo
      const matchValorMaximo = !filtros.valorMaximo || imovel.valor <= Number.parseFloat(filtros.valorMaximo);

      return matchBusca && matchFinalidade && matchValorMinimo && matchValorMaximo;
    });
  };

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
      };

      if (viewMode === 'edit' && imovelSelecionado) {
        await editarImovel(imovelSelecionado.id, imovelData);
        addNotification('success', 'Imóvel editado com sucesso!');
      } else {
        await adicionarImovel(imovelData);
        addNotification('success', 'Imóvel cadastrado com sucesso!');
      }

      setViewMode('list');
      setImovelSelecionado(null);
    } catch (error) {
      addNotification('error', 'Erro ao salvar imóvel. Tente novamente.');
    }
  };

  const handleEditImovel = (imovel: Imovel) => {
    setImovelSelecionado(imovel);
    setViewMode('edit');
  };

  const handleDeleteImovel = (id: string) => {
    setImovelParaExcluir(id);
    setShowDeleteDialog(true);
  };

  const confirmarExclusao = async () => {
    if (imovelParaExcluir) {
      try {
        await excluirImovel(imovelParaExcluir);
        addNotification('success', 'Imóvel excluído com sucesso!');
        setImovelParaExcluir(null);
        setShowDeleteDialog(false);
      } catch (err) {
        addNotification('error', 'Falha ao excluir imóvel');
        setShowDeleteDialog(false)
      }

    }
  };

  const handleViewImovel = (imovel: Imovel) => {
    setImovelDetalhes(imovel);
  };

  const limparFiltros = () => {
    setFiltros({
      finalidade: '',
      valorMinimo: '',
      valorMaximo: '',
    });
    setTermoBusca('');
  };

  const imoveisFiltrados = filtrarImoveis();

  // Componente de loadng

  const LoadingSpinner = () => {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Carregando imóveis...</span>
      </div>)
  }

  // Componente de Error State
  const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="text-center py-12">
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">Ops! Algo deu errado</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button onClick={onRetry} variant="outline">
        Tentar Novamente
      </Button>
    </div>
  )

  // Renderização condicional para formulário
  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="container mx-auto px-4 py-8">
        <ImovelForm
          imovel={imovelSelecionado || undefined}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setViewMode('list');
            setImovelSelecionado(null);
          }}
          isEditing={viewMode === 'edit'}
        />
        <Notifications notifications={notifications} onRemove={removeNotification} />
      </div>
    );
  }

  // Renderização principal
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Plus className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Imóveis</h1>
              <p className="text-muted-foreground">Gerencie seus imóveis para venda e locação</p>
            </div>
          </div>
          <Button onClick={() => setViewMode('create')} className="gap-2" disabled={operationLoading}>
            <Plus className="h-4 w-4" />
            Novo Imóvel
          </Button>
        </div>

        {/* Busca e Filtros */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-3">
            <Input
              placeholder="Buscar por título, endereço ou corretor..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full"
              disabled={operationLoading}
            />
          </div>
          <div className="lg:col-span-1">
            <FiltrosImoveisComponent filtros={filtros} onFiltrosChange={setFiltros} onLimparFiltros={limparFiltros} disabled={operationLoading} />
          </div>
        </div>

        {/* Lista de Imóveis */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3">
            {loading ? (<LoadingSpinner />
            ) : error && imoveis.length === 0 ? (<ErrorState message={error} onRetry={() => window.location.reload()} />) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {imoveisFiltrados.length} {imoveisFiltrados.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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

      {/* Overlay de loading para operações */}
      {operationLoading && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-background border rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Processando...</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      <ImovelDetalhes imovel={imovelDetalhes} open={!!imovelDetalhes} onClose={() => setImovelDetalhes(null)} />

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarExclusao} disabled={operationLoading}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notificações */}
      <Notifications notifications={notifications} onRemove={removeNotification} />
    </div>
  );
}
