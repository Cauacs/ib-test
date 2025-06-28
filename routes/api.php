<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ImovelController;


Route::apiResource('imoveis', ImovelController::class);

Route::get('hello', function() {
    return response()->json(['message' => 'Hello worlde']);
});
