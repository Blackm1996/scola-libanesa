
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('First_Name',50);
            $table->string('Last_Name',50);
            $table->string('Birthday',50);
            $table->string('Birthplace',50);
            $table->string('Tel',50);
            $table->char('Sex');
            $table->string('Teuteur',50);
            $table->string('ID_URL');
            $table->string('Vaccine_URL');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('student_profiles');
    }
}
