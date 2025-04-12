<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'name', 'ownerId', 'status'];

    public function players()
    {
        return $this->hasMany(Player::class);
    }
    public function quizzes()
    {
        return $this->belongsToMany(Quizz::class, 'room_quizz', 'room_id', 'quizz_id');
    }

    public function currentQuizz()
    {
        return $this->belongsTo(Quizz::class, 'current_quizz_id');
    }
}
