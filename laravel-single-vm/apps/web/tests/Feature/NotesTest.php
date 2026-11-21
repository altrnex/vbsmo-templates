<?php

namespace Tests\Feature;

use App\Models\Note;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotesTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_lists_notes(): void
    {
        Note::create(['body' => 'First note']);

        $this->get('/')->assertOk()->assertSee('First note');
    }

    public function test_a_note_can_be_stored(): void
    {
        $this->post('/notes', ['body' => 'Hello'])->assertRedirect('/');

        $this->assertDatabaseHas('notes', ['body' => 'Hello']);
    }

    public function test_a_note_needs_a_body(): void
    {
        $this->post('/notes', ['body' => ''])->assertSessionHasErrors('body');
    }

    public function test_a_user_can_register_and_log_in(): void
    {
        $this->post('/register', [
            'name' => 'Ada',
            'email' => 'ada@example.com',
            'password' => 'a-long-passphrase-1',
            'password_confirmation' => 'a-long-passphrase-1',
        ])->assertRedirect('/');
        $this->assertAuthenticated();

        $this->post('/logout');
        $this->assertGuest();

        $this->post('/login', ['email' => 'ada@example.com', 'password' => 'a-long-passphrase-1'])->assertRedirect('/');
        $this->assertAuthenticatedAs(User::firstWhere('email', 'ada@example.com'));
    }
}
