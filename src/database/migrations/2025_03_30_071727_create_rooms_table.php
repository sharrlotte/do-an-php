<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     *Room: { id: string, name: string, ownerId: string,
     *status: “waiting” | “on_going” | “ended” }, ownerId: là tên chủ phòng/người tạo phòng
     *waiting: game chưa bắt đầu
     *on_going: game đang diễn ra
     *ended: game đã kết thúc
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->unsignedBigInteger('ownerId');
            $table->foreign('ownerId')->references('id')->on('users')->onDelete('cascade');
            $table->enum('status', ['waiting', 'on_going', 'ended']); //set trạng thái phòng
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
