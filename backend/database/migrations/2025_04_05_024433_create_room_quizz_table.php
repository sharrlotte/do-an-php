<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('room_quizz', function (Blueprint $table) {
            $table->string('quizz_id'); //
            $table->string('room_id');  //
            $table->timestamps();

            $table->unique(['room_id', 'quizz_id']);

            $table->foreign('quizz_id')->references('id')->on('quizzes')->onDelete('cascade');
            $table->foreign('room_id')->references('id')->on('rooms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_quizz');
    }
};
