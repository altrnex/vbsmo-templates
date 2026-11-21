<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNoteRequest;
use App\Models\Note;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NoteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('home', [
            'notes' => Note::query()->latest('id')->limit(50)->get(['id', 'body', 'created_at']),
        ]);
    }

    public function store(StoreNoteRequest $request): RedirectResponse
    {
        Note::create($request->validated());

        return to_route('home');
    }
}
