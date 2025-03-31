<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'roomId',
        'score'
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
