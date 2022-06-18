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
        if (!Schema::hasTable('phone_fam')) {
            Schema::create('phone_fam', function (Blueprint $table) {
                $table->id()->autoIncrement();
                $table->foreignId('id_Owner')->constrained('family')->onDelete('cascade')->onUpdate('cascade');
                $table->string('Phone_Nb',50);
                $table->enum('Owner_Type',['Father','Mother']);
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
        Schema::dropIfExists('phone_fam');
    }
};
