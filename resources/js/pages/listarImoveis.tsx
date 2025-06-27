'use client';

import { FiltrosImoveisComponent } from '@/components/filtro-imoveis';
import { ImovelCard } from '@/components/imovel-card';
import { ImovelDetalhes } from '@/components/imovel-detalhes';
import { ImovelForm } from '@/components/imovel-form';
import { Notifications } from '@/components/notifications';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useImoveis } from '@/contexts/imoveis-context';
import { useNotifications } from '@/hooks/use-notifications';
import RootLayout from '@/layouts/imoveis-layout';
import type { FiltrosImoveis, Imovel, ImovelFormData } from '@/types/imovel';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type ViewMode = 'list' | 'create' | 'edit';

export default function ImoveisPage() {
  const { imoveis, adicionarImovel, editarImovel, excluirImovel } = useImoveis();
  const { notifications, addNotification, removeNotification } = useNotifications();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [imovelSelecionado, setImovelSelecionado] = useState<Imovel | null>(null);
  const [imovelDetalhes, setImovelDetalhes] = useState<Imovel | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imovelParaExcluir, setImovelParaExcluir] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');

  const [filtros, setFiltros] = useState<FiltrosImoveis>({
    finalidade: '',
    valorMinimo: '',
    valorMaximo: '',
  });

  const filtrarImoveis = () => {
    return imoveis.filter((imovel) => {
      // Filtro por termo de busca
      const matchBusca =
        !termoBusca ||
        imovel.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        imovel.endereco.toLowerCase().includes(termoBusca.toLowerCase()) ||
        imovel.corretor.toLowerCase().includes(termoBusca.toLowerCase());

      // Filtro por finalidade
      const matchFinalidade = !filtros.finalidade || imovel.finalidade === filtros.finalidade;

      // Filtro por valor mínimo
      const matchValorMinimo = !filtros.valorMinimo || imovel.valor >= Number.parseFloat(filtros.valorMinimo);

      // Filtro por valor máximo
      const matchValorMaximo = !filtros.valorMaximo || imovel.valor <= Number.parseFloat(filtros.valorMaximo);

      return matchBusca && matchFinalidade && matchValorMinimo && matchValorMaximo;
    });
  };

  const handleSubmitForm = (data: ImovelFormData) => {
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
        editarImovel(imovelSelecionado.id, imovelData);
        addNotification('success', 'Imóvel editado com sucesso!');
      } else {
        adicionarImovel(imovelData);
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

  const confirmarExclusao = () => {
    if (imovelParaExcluir) {
      excluirImovel(imovelParaExcluir);
      addNotification('success', 'Imóvel excluído com sucesso!');
      setImovelParaExcluir(null);
      setShowDeleteDialog(false);
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

  return (
    <RootLayout>
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
            <Button onClick={() => setViewMode('create')} className="gap-2">
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
              />
            </div>
            <div className="lg:col-span-1">
              <FiltrosImoveisComponent filtros={filtros} onFiltrosChange={setFiltros} onLimparFiltros={limparFiltros} />
            </div>
          </div>

          {/* Lista de Imóveis */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-3">
              {imoveisFiltrados.length === 0 ? (
                <div className="py-12 text-center">
                  <Plus className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">Nenhum imóvel encontrado</h3>
                  <p className="mb-4 text-muted-foreground">
                    {imoveis.length === 0 ? 'Comece cadastrando seu primeiro imóvel.' : 'Tente ajustar os filtros de busca.'}
                  </p>
                  {imoveis.length === 0 && (
                    <Button onClick={() => setViewMode('create')} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Cadastrar Primeiro Imóvel
                    </Button>
                  )}
                </div>
              ) : (
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
              <Button variant="destructive" onClick={confirmarExclusao}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notificações */}
        <Notifications notifications={notifications} onRemove={removeNotification} />
      </div>
    </RootLayout>
  );
}
