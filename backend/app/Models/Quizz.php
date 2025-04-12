<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quizz extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'quizzes';

    protected $fillable = ['id', 'question', 'user_id', 'created_at'];

    public function answers()
    {
        return $this->hasMany(QuizzAnswer::class, 'quizz_id', 'id');
    }

    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'room_quizz', 'quizz_id', 'room_id');
    }
}
