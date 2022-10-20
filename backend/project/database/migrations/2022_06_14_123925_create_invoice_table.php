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
        if (!Schema::hasTable('invoice'))
        {
            Schema::create('invoice', function (Blueprint $table) {
                $table->id();
                $table->foreignId('id_family')->constrained('family')->onUpdate('cascade')->onDelete('cascade');
                $table->string('School_Year');
                $table->string('Students');
                $table->string('Classes');
                $table->integer('Amount');
                $table->string('Description');
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
        Schema::dropIfExists('invoice');
    }
};
