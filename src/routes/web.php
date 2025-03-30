<?php

use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::post('/rooms', [RoomController::class, 'createRoom']);
Route::post('/rooms/{roomId}/join', [RoomController::class, '']);
Route::get('/rooms/{id}/players', [RoomController::class, '']);
Route::get('rooms/{id}/current-quizz', [RoomController::class, '']);
Route::post('/rooms/{id}/answer', [RoomController::class, '']);
Route::post(' /rooms/{id}/start', [RoomController::class, '']);
Route::get('/rooms/{id}/quizz', [RoomController::class, '']);
Route::post(' /rooms/{id}/quizz', [RoomController::class, '']);
Route::delete('/rooms/{id}/quizz/{quizzId}', [RoomController::class, '']);
