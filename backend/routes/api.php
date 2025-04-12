<?php
// routes/api.php

use App\Http\Controllers\Api\V1\RoomController;
use App\Http\Controllers\Api\V1\QuizzController;
use App\Http\Controllers\Api\V1\QuizzAnswerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// routes/api.php

Route::prefix('v1')->group(function () {

    //Room API
    Route::middleware('auth')->post('/rooms', [RoomController::class, 'createRoom']); //để quản lý quyền
    // Route::post('/rooms', [RoomController::class, 'createRoom']); //test postman
    Route::post('/rooms/{id}/join', [RoomController::class, 'joinRoom']); //done
    Route::get('/rooms/{roomId}/players', [RoomController::class, 'getPlayers']); //done

    Route::get('/rooms/{roomId}/quizz', [RoomController::class, 'getRoomQuizzes']); //done
    Route::get('/rooms/{roomId}/current-quizz', [RoomController::class, 'getCurrentQuizz']); //done
    Route::post('/rooms/{roomId}/answer', [RoomController::class, 'answerQuizz']); //done

    Route::post('/rooms/{roomId}/start', [RoomController::class, 'startGame']); //done

    Route::post('/rooms/{roomId}/quizz', [RoomController::class, 'addQuizzToRoom']); //done
    Route::delete('/rooms/{roomId}/quizz/{quizzId}', [RoomController::class, 'removeQuizzFromRoom']);

    Route::middleware('auth')->get('/@me', function (Request $request) {
        return $request->user();
    });
});

//Quiz API
Route::middleware(['web'])->prefix('v1')->group(function () {
    // Public routes
    Route::get('/quizz', [QuizzController::class, 'getMyQuizzes']);
    Route::post('/quizz', [QuizzController::class, 'createQuizz']); //done
    Route::patch('/quizz/{id}', [QuizzController::class, 'updateQuizz']);
    Route::delete('/quizz/{id}', [QuizzController::class, 'deleteQuizz']);
});

//QuizAnswer API
Route::middleware('web')->prefix('v1')->group(function () {
    // Route::prefix('v1')->group(function () {//cmnt để test postman
    Route::post('/quizz/{id}/answers', [QuizzAnswerController::class, 'createAnswer']);
    Route::patch('/answers/{id}', [QuizzAnswerController::class, 'updateAnswer']);
    Route::delete('/answers/{id}', [QuizzAnswerController::class, 'deleteAnswer']);
});
