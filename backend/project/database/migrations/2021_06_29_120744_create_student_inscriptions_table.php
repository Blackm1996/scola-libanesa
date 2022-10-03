<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentInscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Student_Inscriptions', function (Blueprint $table) {
            $table->foreignId('id_student')->constrained('student_profiles')->onDelete('cascade');
            $table->foreignId('id_grade')->constrained('Grades')->onDelete('cascade');
            $table->primary(['id_student','id_grade']);
            $table->string('School_Year')->nullable();
            $table->integer('Inscription_Tax');
            $table->integer('Books_Uniform_total');
            $table->integer('Monthly_Total');
            $table->integer('Month_Start');
            $table->foreignId('id_classroom')->nullable()->constrained('classrooms')->unsigned()->onDelete('set null');
            $table->timestamps();	
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('student_inscriptions');
    }
}
