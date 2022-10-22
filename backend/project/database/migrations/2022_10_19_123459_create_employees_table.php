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
            $table->bigInteger("base_salary")->default(0);
            $table->integer("debt_pay_perMonth")->default(0);
            $table->enum("position",['prof','menor','stagiere','superviseur'])->default('prof');
            $table->date("start_position");
            $table->date("end_position")->nullable();
            $table->tinyInteger('is_Working')->default(1);
            
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
