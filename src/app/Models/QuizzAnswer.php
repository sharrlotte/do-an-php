<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizzAnswer extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'quizz_id', 'content', 'isAnswer'];

    protected $casts = [
        'isAnswer' => 'boolean',
    ];

    public function quizz()
    {
        return $this->belongsTo(Quizz::class, 'quizz_id');
    }
}
