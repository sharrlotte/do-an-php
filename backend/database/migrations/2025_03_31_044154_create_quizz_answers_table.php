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
            $table->string('id')->primary();
            $table->string('quizz_id');
            $table->string('content');
            $table->boolean('isAnswer')->default(false);
            $table->timestamps();

            $table->foreign('quizz_id')->references('id')->on('quizzes')->onDelete('cascade');
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
