<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;

class RoomController extends Controller
{
    //tạo phòng
    public function createRoom(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'ownerId' => 'required|string|max:255',
            'status' => 'required|string|in:waiting,on_going,ended'
        ]);

        $room = Room::create([
            'name' => $request->name,
            'ownerId' => $request->ownerId,
            'status' => $request->status,
        ]);

        return response()->json(['message' => 'Đã tạo phòng!', 'room' => $room]);
    }

    //cập nhật
    public function updateRoom(Request $request, $id)
    {
        $room = Room::find($id);

        if (!$room)
            return response()->json(['message' => 'Không thấy phòng'], 404);

        $room->DB::update($request->all());

        return response()->json(['message' => 'Đã cập nhật', 'room' => $room]);
    }

    //xóa
    public function deleteRoom($id)
    {
        $room = Room::find($id);

        if (!$room)
            return response()->json(['message' => 'Không thấy phòng'], 404);

        $room->delete();

        return response()->json(['message' => 'Đã xóa'], 200);
    }
}
