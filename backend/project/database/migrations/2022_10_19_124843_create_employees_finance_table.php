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
        Schema::create('employees_finance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_employee')->constrained('employees')->onDelete('cascade')->onUpdate('cascade');
            $table->bigInteger('Amount')->default(0);
            $table->enum('Type', ['debt', 'debt_pay','salary','penalty','reward'])->default('debt');
            $table->string('description', 250)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees_finance');
    }
};
