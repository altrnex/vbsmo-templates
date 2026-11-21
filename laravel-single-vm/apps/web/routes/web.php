<?php

use App\Http\Controllers\NoteController;
use Illuminate\Support\Facades\Route;

Route::get('/', [NoteController::class, 'index'])->name('home');
Route::post('/notes', [NoteController::class, 'store'])->name('notes.store');
