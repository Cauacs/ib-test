<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('imovels', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('descricao');
            $table->string('endereco');
            $table->enum('finalidade', ['venda', 'locacao'])->default('locacao');
            $table->decimal('valor', 15, 2);
            $table->unsignedTinyInteger('quartos');
            $table->unsignedTinyInteger('banheiros');
            $table->boolean('possui_garamgem');
            $table->string('nome_corretor');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imovels');
    }
};
