<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\QuizzAnswer;
use App\Models\Quizz;
use Illuminate\Support\Str;

class QuizzAnswerController extends Controller
{
    //tao answer
    public function createAnswer(Request $request, $quizzId)
    {
        $request->validate([
            'content' => 'required|string|max:255',
            'isAnswer' => 'required|boolean',
        ]);

        $quizz = Quizz::find($quizzId);
        if (!$quizz) {
            return response()->json(['message' => 'Không tìm thấy quiz'], 404);
        }

        if (Auth::id() !== $quizz->user_id) {
            return response()->json(['message' => 'Bạn không có quyền thêm đáp án'], 403);
        }

        if ($request->isAnswer && QuizzAnswer::where('quizz_id', $quizzId)->where('isAnswer', true)->exists()) {
            return response()->json(['message' => 'Quiz này đã có đáp án đúng rồi'], 400);
        }

        $answer = QuizzAnswer::create([
            'id' => Str::uuid(),
            'quizz_id' => $quizzId,
            'content' => $request->content,
            'isAnswer' => $request->isAnswer,
        ]);

        return response()->json([
            'message' => 'Tạo đáp án thành công',
            'answer' => $answer,
        ]);
    }

    //sua answer
    public function updateAnswer(Request $request, $answerId)
    {
        $request->validate([
            'content' => 'required|string|max:255',
            'isAnswer' => 'required|boolean',
        ]);

        $answer = QuizzAnswer::with('quizz')->find($answerId);
        if (!$answer)
            return response()->json(['message' => 'Không tìm thấy đáp án'], 404);

        $user = Auth::user();
        if (!$user || $user->id !== $answer->quizz->user_id) {
            return response()->json(['message' => 'Bạn không có quyền sửa đáp án'], 403);
        }

        if ($request->isAnswer) {
            $exists = QuizzAnswer::where('quizz_id', $answer->quizz_id)
                ->where('isAnswer', true)
                ->where('id', '!=', $answerId)
                ->exists();

            if ($exists)
                return response()->json(['message' => 'Quiz này đã có đáp án đúng rồi'], 400);
        }

        $answer->update([
            'content' => $request->content,
            'isAnswer' => $request->isAnswer,
        ]);


        return response()->json([
            'message' => 'Cập nhật đáp án thành công',
            'answer' => $answer,
        ]);
    }

    //xoa answer
    public function deleteAnswer($answerId)
    {
        $answer = QuizzAnswer::with('quizz')->Find($answerId);

        if (!$answer)
            return response()->json(['message' => 'Không tìm thấy đáp án'], 404);

        $user = Auth::user();
        if (!$user || $user->id !== $answer->quizz->user_id) {
            return response()->json(['message' => 'Bạn không có quyền xóa đáp án'], 403);
        }

        $answer->delete();
        return response()->json(['message' => 'Xóa đáp án thành công']);
    }
}
