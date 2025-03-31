<?php
namespace App\Http\Controllers;

use App\Models\Quizz;
use App\Models\QuizzAnswer;
use Illuminate\Http\Request;

class QuizzAnswerController extends Controller
{
    // Thêm câu trả lời mới
    public function store(Request $request, $quizzId)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'isAnswer' => 'required|boolean',
        ]);

        $answer = QuizzAnswer::create([
            'quizzId' => $quizzId,
            'content' => $validated['content'],
            'isAnswer' => $validated['isAnswer'],
        ]);

        return response()->json([
            'message' => 'Answer Created',
            'data' => [
                'id' => $answer->id,
                'quizzId' => $answer->quizzId,
                'content' => $answer->content,
                'isAnswer' => $answer->isAnswer,
                'created_at' => $answer->created_at,
                'updated_at' => $answer->updated_at,
            ]
        ], 201);
    }
}