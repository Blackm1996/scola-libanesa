<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('medical')) {
            Schema::create('medical', function (Blueprint $table) {
                $table->id();
                $table->foreignId('id_student')->constrained('student_profiles')->onDelete('cascade')->onUpdate('cascade');
                $table->string('Name',50);
                $table->string('Description',255);
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('medical');
    }
};
