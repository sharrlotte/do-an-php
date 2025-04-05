<?php
// routes/api.php

use App\Http\Controllers\Api\V1\RoomController;
use App\Http\Controllers\Api\V1\QuizzController;

use Illuminate\Support\Facades\Route;
// routes/api.php


Route::prefix('v1')->group(function () {

    //Room API
    // Route::middleware('auth')->post('/rooms', [RoomController::class, 'createRoom']); để quản lý quyền
    Route::post('/rooms', [RoomController::class, 'createRoom']); //test postman
    Route::post('/rooms/{id}/join', [RoomController::class, 'joinRoom']); //done
    Route::get('/rooms/{roomId}/players', [RoomController::class, 'getPlayers']); //done

    Route::get('/rooms/{roomId}/quizz', [RoomController::class, 'getRoomQuizzes']); //done
    Route::get('/rooms/{roomId}/current-quizz', [RoomController::class, 'getCurrentQuizz']); //done
    Route::post('/rooms/{roomId}/answer', [RoomController::class, 'answerQuizz']); //done

    Route::post('/rooms/{roomId}/start', [RoomController::class, 'startGame']); //done

    Route::post('/rooms/{roomId}/quizz', [RoomController::class, 'addQuizzToRoom']); //done
    Route::delete('/rooms/{roomId}/quizz/{quizzId}', [RoomController::class, 'removeQuizzFromRoom']);
});

//Quiz API
// Route::middleware('auth')->prefix('v1')->group(function () { //cmnt để test postman
Route::prefix('v1')->group(function () {

    Route::get('/quizz', [QuizzController::class, 'getMyQuizzes']); //done
    Route::post('/quizz', [QuizzController::class, 'createQuizz']); //done
    Route::patch('/quizz/{id}', [QuizzController::class, 'updateQuizz']);
    Route::delete('/quizz/{id}', [QuizzController::class, 'deleteQuizz']);
});
