<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Player;

use Symfony\Contracts\Service\Attribute\Required;

class RoomController extends Controller
{
    //tạo phòng
    public function createRoom(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',

        ]);

        $room = Room::create([
            'name' => $request->name,
            'ownerId' => $request->ownerId, //hmmm
            'status' => 'waiting'
        ]);

        $roomId = str_pad($room->id, 6, '0', STR_PAD_LEFT);

        $room->update([
            'roomId' => $roomId,
        ]);

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
