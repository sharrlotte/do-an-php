<?php
// routes/api.php

use App\Http\Controllers\Api\V1\RoomController;
use Illuminate\Support\Facades\Route;
// routes/api.php


Route::prefix('v1')->group(function () {

    // Route::middleware('auth')->post('/rooms', [RoomController::class, 'createRoom']); để quản lý quyền
    Route::post('/rooms', [RoomController::class, 'createRoom']); //test postman

    Route::post('/rooms/{id}/join', [RoomController::class, 'joinRoom']); //done
    Route::get('/rooms/{roomId}/players', [RoomController::class, 'getPlayers']); //done

    Route::get('/rooms/{roomId}/quizz', [RoomController::class, 'getRoomQuizzes']); //done
    Route::get('/rooms/{roomId}/current-quizz', [RoomController::class, 'getCurrentQuizz']); //done
    Route::post('/rooms/{roomId}/answer', [RoomController::class, 'answerQuizz']); //done

    Route::post('/rooms/{roomId}/start', [RoomController::class, 'startGame']); //done

    Route::post('/rooms/{roomId}/quizz', [RoomController::class, 'addQuizzToRoom']); //done
    Route::delete('/rooms/{roomId}/quizz/{quizzId}', [RoomController::class, 'removeQuizzFromRoom']); //chưa có quizzID
});
