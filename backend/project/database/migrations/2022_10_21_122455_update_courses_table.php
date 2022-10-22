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
        Schema::dropIfExists("courses");
        if (!Schema::hasTable('courses'))
        {
            Schema::create('courses', function (Blueprint $table) {
                $table->foreignId('id_course')->constrained('course_infos')->onDelete('cascade')->onUpdate('cascade');
                $table->foreignId('id_classroom')->constrained('classrooms')->unsigned()->onDelete('cascade')->onUpdate('cascade');
                $table->foreignId('id_instructor')->constrained('employees')->onDelete('cascade')->onUpdate('cascade');
                $table->primary(['id_course','id_classroom']);
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
        Schema::dropIfExists("courses");
    }
};
