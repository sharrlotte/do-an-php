<?php
// routes/api.php

use App\Http\Controllers\Api\V1\RoomController;
use Illuminate\Support\Facades\Route;
// routes/api.php


Route::prefix('v1')->group(function () {

    Route::post('/rooms', [RoomController::class, 'createRoom'])->withoutMiddleware('auth');
    Route::post('/rooms/{roomId}/join', [RoomController::class, 'joinRoom']);
    Route::get('/rooms/{roomId}/players', [RoomController::class, 'getPlayers']);
    Route::get('/rooms/{id}/current-quizz', [RoomController::class, 'getCurrentQuizz']);
    Route::post('/rooms/{id}/answer', [RoomController::class, 'answerQuestion']);
    Route::post('/rooms/{roomId}/start', [RoomController::class, 'startGame']);
    Route::get('/rooms/{id}/quizz', [RoomController::class, 'getQuizzes']);
    Route::post('/rooms/{id}/quizz', [RoomController::class, 'addQuizz']);
    Route::delete('/rooms/{id}/quizz/{quizzId}', [RoomController::class, 'removeQuizz']);
});
