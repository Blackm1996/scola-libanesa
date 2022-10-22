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
        Schema::dropIfExists("instructors");
        if (!Schema::hasTable('instructors'))
        {
            Schema::create('instructors', function (Blueprint $table) {
                $table->foreignId('id_employee')->constrained('employees')->onUpdate('cascade')->onDelete('cascade');
                $table->string('Major',100);
                $table->primary('id_employee');
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
        Schema::dropIfExists("instructors");
    }
};
