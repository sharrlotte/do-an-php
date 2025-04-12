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
        return Inertia::render('room', [$id]);
    })->name('room');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
