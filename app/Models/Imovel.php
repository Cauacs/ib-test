<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Imovel extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'titulo',
        'descricao',
        'endereco',
        'finalidade',
        'valor',
        'quartos',
        'banheiros',
        'garagem',
        'corretor',
    ];

    protected $casts = [
        'possui_garagem' => 'boolean',
        'valor' => 'decimal:2',
    ];
}
