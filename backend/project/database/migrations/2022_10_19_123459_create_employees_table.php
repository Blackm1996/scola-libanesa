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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('First_Name',50);
            $table->string('Last_Name',50);
            $table->string('Birthday',50);
            $table->string('Tel',50)->nullable();
            $table->string('Address',100)->nullable();
            $table->string("Nationality",50)->nullable();
            $table->enum("Type",['full_time','hourly','stage'])->default('full_time');
            $table->integer("base_salary")->default(0);
            $table->enum("position",['prof','menor','stagiere','superviseur'])->default('prof');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
};
