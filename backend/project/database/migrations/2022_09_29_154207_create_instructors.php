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
        Schema::dropIfExists('instructors');
        if (!Schema::hasTable('instructors'))
        {
            Schema::create('instructors', function (Blueprint $table) {
                $table->id()->autoIncrement();
                $table->string('First_Name',50);
                $table->string('Last_Name',50);
                $table->string('Adress',50);
                $table->string('Major',50);
                $table->string('Nationality',50);
                $table->string('Tel',50);
                $table->string('Birthday',50);
                $table->timestamps();
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
        Schema::dropIfExists('instructors');
    }
};
