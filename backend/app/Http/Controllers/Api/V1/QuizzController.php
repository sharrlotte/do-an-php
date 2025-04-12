<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use App\Models\Quizz;

class QuizzController extends Controller
{
    //tạo quiz
    public function createQuizz(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        if (!$user)
            return response()->json(['message' => 'Bạn cần đăng nhập để tạo quiz'], 401);
        //$userId = 1; //test postman

        $quizz = Quizz::create([
            'id' => Str::uuid(),
            'question' => $request->question,
            'user_id' => $user->id,
            //'user_id' => $userId //test postman
        ]);

        return response()->json([
            'message' => 'Tạo quiz thành công',
            'quizz' => $quizz,
        ]);
    }

    //ds quiz
    public function getMyQuizzes(Request $request)
    {
        $request->validate([
            'page' => 'required|integer|min:1',
            'size' => 'required|integer|min:10|max:100',
        ]);

        $user = Auth::user();
        if (!$user)
            return response()->json(['message' => 'Bạn chưa đăng nhập'], 401);

        if (isset($request->q)) {
            $quizzes = Quizz::where('user_id', $user->id)
                ->where('question', 'like', '%' . $request->q . '%')
                ->orderBy('created_at', 'desc')
                ->paginate($request->size);

            return response()->json($quizzes)
                ->header('Content-Type', 'application/json');
        }

        $quizzes = Quizz::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($request->size);

        return response()->json($quizzes)
            ->header('Content-Type', 'application/json');
    }

    //sửa quiz
    public function updateQuizz(Request $request, $id)
    {
        $request->validate([
            'question' => 'required|string|max:255'
        ]);

        $quizz = Quizz::find($id);
        if (!$quizz) {
            return response()->json(['message' => 'Không tìm thấy quiz'], 404);
        }

        if ($quizz->user_id !== Auth::user()->id)
            return response()->json(['message' => 'Bạn không có quyền sửa quiz này'], 403);

        $quizz->question = $request->question;
        $quizz->save();

        return response()->json([
            'message' => 'Sửa quiz thành công',
            'quizz' => $quizz,
        ]);
    }

    //xóa quiz
    public function deleteQuizz($id)
    {
        $quizz = Quizz::find($id);
        if ($quizz->user_id !== Auth::user()->id)
            return response()->json(['message' => 'Bạn không có quyền xóa quiz này'], 403);

        $quizz->delete();

        return response()->json([
            'message' => 'Xóa quiz thành công',
        ]);
    }
}
