import { Imovel } from '@/types/imovel';

const API_URL = 'http://localhost/api/imoveis';

export const fetchImoveis = async (): Promise<Imovel[]> => {
    const response = await fetch(API_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    });

    if (!response.ok) throw new Error("Erro ao carregar imóveis");
    return response.json();
};

export const fetchImovel = async(id: string): Promise<Imovel> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    })

    if(!response.ok) throw new Error("Erro ao carregar imóvel com ID: " + id);
    return response.json()
}


export const createImovel = async (imovel: Omit<Imovel, "id" | "createdAt">): Promise<Imovel> =>{
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(imovel)
    })

    if(!response.ok) throw new Error("Erro ao criar imóvel");
    return response.json();
}

export const updateImovel = async (id: string, imovel: Partial<Imovel>): Promise<Imovel> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(imovel)
    })
    if(!response.ok) throw new Error("Error ao atualizar imóvel");
    return response.json()
}

export const deleteImovel = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    })
    if (!response.ok) throw new Error("Erro ao excluir imóvel");
}