<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Player;
use App\Models\Quizz;

use Illuminate\Support\Facades\Auth;

class RoomController extends Controller
{
    //tạo phòng
    public function createRoom(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);


        $user = Auth::user();
        $ownerId = $user?->id ?? 1; // fallback nếu chưa login

        do {
            $roomId = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (Room::where('id', $roomId)->exists());

        $room = Room::create([
            'id' => $roomId,
            'name' => $request->name,
            'ownerId' => $ownerId,
            'status' => 'waiting'
        ]);

        return response()->json([
            'message' => 'Tạo phòng thành công',
            'roomId' => $roomId
        ]);
    }


    //vào phòng
    public function joinRoom($id, Request $request)
    {
        $room = Room::find($id);
        if (!$room) return response()->json(['message' => 'Không thấy phòng'], 404);

        $user = Auth::user();
        $playerId = $request->input('playerId');
        $name = $request->input('name');

        $existsQuery = Player::where('roomId', $id);

        if ($user) {
            $existsQuery->where('user_id', $user->id);
        } else {
            $existsQuery->where('id', $playerId);
        }

        if ($existsQuery->exists()) {
            return response()->json(['message' => 'Bạn đã vào phòng rồi'], 400);
        }

        $player = Player::create([
            'id' => $playerId ?? (string) Str::uuid(),
            'roomId' => $id,
            'user_id' => $user?->id,
            'name' => $name ?? ($user?->name ?? 'Ẩn danh'),
            'score' => 0,
        ]);

        return response()->json(['name' => $room->name]);
    }


    //Lấy thông tin người chơi
    public function getPlayers($roomId)
    {
        $room = Room::find($roomId);
        if (!$room)
            return response()->json(['message' => 'Không có phòng'], 404);

        $players = Player::where('roomId', $roomId)->orderBy('score', 'asc')->get();
        return response()->json($players);
    }


    //Lấy quizz hiện tại
    public function getCurrentQuizz($roomId)
    {
        $room = Room::with('currentQuizz.answers')->find($roomId);

        if (!$room || !$room->currentQuizz) {
            return response()->json(['message' => 'Không có câu hỏi hiện tại'], 404);
        }

        $question = $room->currentQuizz->question;
        $answers = $room->currentQuizz->answers->map(function ($a) {
            return [
                'id' => $a->id,
                'content' => $a->content
            ];
        });

        return response()->json([
            'question' => $question,
            'answer' => $answers
        ]);
    }


    // Trả lời câu hỏi
    public function answerQuizz($roomId, Request $request)
    {
        $request->validate([
            'answerId' => 'required|string',
            'playerId' => 'required|string',
        ]);

        $room = Room::find($roomId);
        if (!$room) return response()->json(['message' => 'Phòng không tồn tại'], 404);

        $answer = \App\Models\QuizzAnswer::find($request->answerId);
        if (!$answer) return response()->json(['message' => 'Không có câu trả lời'], 404);

        $quizz = $answer->quizz;
        if (!$quizz) return response()->json(['message' => 'Không tìm thấy câu hỏi'], 404);

        $user = Auth::user();
        $player = $user
            ? Player::where('roomId', $roomId)->where('user_id', $user->id)->first()
            : Player::where('roomId', $roomId)->where('id', $request->playerId)->first();

        if (!$player) return response()->json(['message' => 'Bạn chưa tham gia phòng này'], 403);

        $isCorrect = $answer->isAnswer;

        if ($isCorrect) {
            $player->score += 10;
            $player->save();
        }

        return response()->json([
            'correct' => $isCorrect,
            'new_score' => $player->score,
        ]);
    }



    // Bắt đầu trò chơi
    public function startGame($roomId)
    {
        $room = Room::with('quizzes')->find($roomId);
        if (!$room)
            return response()->json(['message' => 'Không có phòng'], 404);

        if ($room->status === 'on_going') {
            return response()->json(['message' => 'Trò chơi đã bắt đầu'], 400);
        }

        $quizz = $room->quizzes->random();

        $room->status = 'on_going';
        $room->current_quizz_id = $quizz->id;
        $room->save();

        return response()->json([
            'message' => 'Bắt đầu thành công',
            'first_quizz' => [
                'question' => $quizz->question,
                'answers' => $quizz->answers->map(function ($a) {
                    return [
                        'id' => $a->id,
                        'content' => $a->content
                    ];
                })
            ]
        ]);
    }


    // Lấy danh sách quizz
    public function getRoomQuizzes($roomId)
    {
        $room = Room::with('quizzes')->find($roomId);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy phòng'], 404);
        }

        return response()->json($room->quizzes);
    }


    // Thêm quizz
    public function addQuizzToRoom($roomId, Request $request)
    {
        $request->validate([
            'quizzId' => 'required|string|exists:quizzes,id'
        ]);

        $room = Room::find($roomId);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy phòng'], 404);
        }

        $room->quizzes()->syncWithoutDetaching([$request->quizzId]);

        return response()->json(['message' => 'Đã thêm quiz vào phòng']);
    }

    // Xóa quizz khỏi phòng
    public function removeQuizzFromRoom($roomId, $quizzId)
    {
        $room = Room::find($roomId);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy phòng'], 404);
        }

        $room->quizzes()->detach($quizzId);

        return response()->json(['message' => 'Đã xoá quiz khỏi phòng']);
    }
}
