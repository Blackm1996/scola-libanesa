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
        if (!Schema::hasTable('guardian')) {
            Schema::create('guardian', function (Blueprint $table) {
                $table->id();
                $table->string('Name',50);
                $table->string('Profession',50);
                $table->string('Address',50);
                $table->string('Comm_Phone',50);
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
        Schema::dropIfExists('guardian');
    }
};
