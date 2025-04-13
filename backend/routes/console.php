<?php

use App\Models\Quizz;
use App\Models\Room;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB; // Add this import

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Artisan::command("update", function () {
Schedule::call(function () {
    $rooms = Room::where('status', 'on_going')->get();
    $rooms->each(function ($room) {

        if ($room->current_quizz_id == null) {
            $first_quizz = $room->quizzes()->orderBy('room_quizz.created_at')->first();
            if ($first_quizz) {
                $room->current_quizz_id = $first_quizz->id;
                $room->save();
            }
        }


        if ($room->next && $room->next > Carbon::now()) {
            return;
        }

        echo "Room {$room->id}: Checking quiz {$room->current_quizz_id}\n";

        $current_quizz = DB::table('room_quizz')
            ->where('room_id', $room->id)
            ->where('quizz_id', $room->current_quizz_id)
            ->first();

        $currentCreatedAt = $current_quizz->created_at ?? null;

        echo "Room {$room->id}: Checking quiz {$room->current_quizz_id} created at {$currentCreatedAt}\n";


        // Next time - current time > 20s
        $next_quizz = DB::table('quizzes')
            ->join('room_quizz', 'quizzes.id', '=', 'room_quizz.quizz_id')
            ->where('room_quizz.room_id', $room->id)
            ->where('room_quizz.created_at', '>', $currentCreatedAt)
            ->orderBy('room_quizz.created_at', 'asc')
            ->select('quizzes.*')
            ->first();

        if ($next_quizz) {
            echo "Room {$room->id}: Moving from quiz {$room->current_quizz_id} to next quiz {$next_quizz->id} created at {$next_quizz->created_at}\n";
            $room->current_quizz_id = $next_quizz->id;
            $room->next = now("UTC")->addSeconds(20);
            $room->save();
            echo "Room {$room->id}: Moved from {$current_quizz->id} to next quiz {$next_quizz->id}\n";
        } else {
            echo "Room {$room->id}: No more quizzes available, marking as ended\n";
            $room->status = 'ended';
            $room->next = null;
            $room->current_quizz_id = null;
            $room->save();
            echo "Room {$room->id}: Marked as ended\n";
        }
    });
})->everySecond()->thenWithOutput(function (Stringable $output) {
    echo $output;
})->onFailureWithOutput(function (Stringable $output) {
    echo $output;
});

// Removed invalid lines at the end

