<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quizz extends Model
{

    use HasFactory;
    //
    protected $fillable = ['question', 'user_id'];
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
