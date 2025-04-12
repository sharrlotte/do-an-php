<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomQuizz extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'quizz_id', 'room_id'];

    public function quizz()
    {
        return $this->belongsTo(Quizz::class, 'quizz_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }
}
