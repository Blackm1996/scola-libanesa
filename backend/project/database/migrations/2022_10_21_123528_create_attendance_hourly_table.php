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
        Schema::create('attendance_hourly', function (Blueprint $table) {
            $table->foreignId('id_employee')->constrained('employees')->onUpdate('cascade')->onDelete('cascade');
            $table->date('for_day');
            $table->integer('hours')->unsigned()->default(0);
            $table->integer('minutes')->unsigned()->default(0);
            $table->primary(['id_employee','for_day']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('attendance_hourly');
    }
};
