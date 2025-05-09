<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HouseController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/houses', [HouseController::class, 'index']);
Route::post('/houses/{house}', [HouseController::class, 'update']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
