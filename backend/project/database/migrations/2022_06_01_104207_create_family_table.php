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
        if (!Schema::hasTable('family')) {
            Schema::create('family', function (Blueprint $table) {
                $table->id()->autoIncrement();
                $table->string('Father_Name',50);
                $table->string('Father_Profession',50);
                $table->string('Father_Address',50);
                $table->string('Mother_Name',50);
                $table->string('Mother_Profession',50);
                $table->string('Mother_Address',50);
                $table->string('Comm_Phone',50);
                $table->enum('Comm_Owner',['Father','Mother']);
                $table->tinyInteger('is_Whats',1);
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
        Schema::dropIfExists('family');
    }
};
