<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name(name: 'home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('room', function () {
        return Inertia::render('room');
    })->name('room');

    Route::get('room/{id}', function ($id) {
        return Inertia::render('room/id', ['id' => $id]);
    })->name('room');
    
    Route::get('play', function () {
        return Inertia::render('play');
    })->name('play');
    
    Route::get('play/{id}', function ($id) {
        return Inertia::render('play/id', ['id' => $id]);
    })->name('play');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
