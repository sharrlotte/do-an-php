<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
    //
    protected $fillable = ['name', 'ownerId', 'status'];
    public function players()
    {
        return $this->hasMany(Player::class);
    }
}
