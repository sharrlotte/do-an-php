<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Player;
use Illuminate\Support\Facades\Auth;

class RoomController extends Controller
{
    //tạo phòng
    public function createRoom(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Lấy người dùng hiện tại đã đăng nhập
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Chưa đăng nhập'], 401);
        }

        // Lấy ID của người dùng để làm ownerId
        $ownerId = $user->id;

        // Tạo phòng
        $room = Room::create([
            'name' => $request->name,
            'ownerId' => $ownerId,
            'status' => 'waiting'
        ]);

        // Đảm bảo roomId có 6 chữ số
        $roomId = str_pad($room->id, 6, '0', STR_PAD_LEFT);

        // Cập nhật lại roomId
        $room->update([
            'roomId' => $roomId,
        ]);

        // Trả về roomId đã được tạo
        return response()->json(['roomId' => $room->roomId]);
    }


    //vào phòng
    public function joinRoom($roomId, Request $request)
    {
        $playerId = $request->input('playerId');
        $name = $request->input('name');

        //check
        $room = Room::find($roomId);
        if (!$room)
            return response()->json(['message' => 'Không thấy phòng'], 404);

        $existingPlayer = Player::where('roomId', $roomId)->where('id', $playerId)->first();
        if ($existingPlayer)
            return response()->json(['message' => 'Bạn đang trong phòng'], 400);


        $player = Player::create([
            'name' => $name,
            'roomId' => $roomId,
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

    // Trả lời câu hỏi

    // Bắt đầu trò chơi
    public function startGame($roomId)
    {
        $room = Room::find($roomId);
        if (!$room)
            return response()->json(['message' => 'Không có phòng'], 404);

        $room->status = 'on_going';
        $room->save();

        return response()->json(['message' => 'Doooo']);
    }

    // Lấy danh sách quizz

    // Thêm quizz

    // Xóa quizz khỏi phòng
}
