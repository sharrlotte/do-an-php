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
        Schema::create('quizz_answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('quizzId');
            $table->string('content');
            $table->boolean('isAnswer');
            $table->timestamps();

            // Nếu có bảng quizzes, thêm khóa ngoại
            $table->foreign('quizzId')->references('id')->on('quizzes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizz_answers');
    }
};