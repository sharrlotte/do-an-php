<?php
// routes/api.php

use App\Http\Controllers\Api\V1\RoomController;
use Illuminate\Support\Facades\Route;
// routes/api.php


Route::prefix('v1')->group(function () {

    Route::middleware('auth:sanctum')->post('/rooms', [RoomController::class, 'createRoom']);

    Route::post('/rooms/{roomId}/join', [RoomController::class, 'joinRoom']);
    Route::get('/rooms/{roomId}/players', [RoomController::class, 'getPlayers']);
    Route::get('/rooms/{roomId}/current-quizz', [RoomController::class, 'getCurrentQuizz']);
    // Route::post('/rooms/{roomId}/answer', [RoomController::class, '']);
    Route::post('/rooms/{roomId}/start', [RoomController::class, 'startGame']);
    // Route::get('/rooms/{roomId}/quizz', [RoomController::class, '']);
    // Route::post('/rooms/{roomId}/quizz', [RoomController::class, '']);
    // Route::delete('/rooms/{roomId}/quizz/{quizzId}', [RoomController::class, '']);
});
