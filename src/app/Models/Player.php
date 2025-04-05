<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'roomId', 'user_id', 'name', 'score'];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
