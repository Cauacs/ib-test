<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Imovel;

class ImovelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Imovel::all(),200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'titulo' => 'required|string|max:255',
            'descricao' => 'required|string',
            'endereco' => 'required|string|max:255',
            'finalidade' => 'required|in:Venda,Locação',
            'valor' => 'required|numeric|min:0',
            'quartos' => 'required|integer|min:0',
            'banheiros' => 'required|integer|min:0',
            'garagem' => 'required|boolean',
            'corretor' => 'required|string|max:255',
        ]);

        $imovel = Imovel::create($validate);

        return response()->json($imovel, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $imovel = Imovel::find($id);

        if(!$imovel){
            return response()->json(['message' => 'Imóvel não encontrado'], 404);
        }

        return response()->json($imovel, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $imovel = Imovel::find($id);

        if(!$imovel){
            return response()->json(['message' => 'Imóvel não encontrado'], 404);
        }
        
        $validated = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'descricao' => 'sometimes|required|string',
            'endereco' => 'sometimes|required|string|max:255',
            'finalidade' => 'sometimes|required|in:Venda,Locação',
            'valor' => 'sometimes|required|numeric|min:0',
            'quartos' => 'sometimes|required|integer|min:0',
            'banheiros' => 'sometimes|required|integer|min:0',
            'garagem' => 'sometimes|required|boolean',
            'corretor' => 'sometimes|required|string|max:255',
        ]);

        $imovel->update($validated);

        return response()->json($imovel, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $imovel = Imovel::find($id);

        if(!$imovel){
            return response()->json(['message' => 'Imóvel não encontrado'],404);
        }

        $imovel->delete();

        return response()->json(['message' => 'Imóvel excluido com sucesso'], 200);
    }
}
