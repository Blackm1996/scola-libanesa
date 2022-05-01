<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCourseInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('course_infos', function (Blueprint $table) {
            $table->id();
            $table->string('Name');
            $table->foreignId('id_grade')->constrained('Grades')->onDelete('cascade');
            $table->integer('score');
           
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('course_infos');
    }
}
