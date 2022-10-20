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
        Schema::dropIfExists("expenses");
        if (!Schema::hasTable('expenses'))
        {
            Schema::create('expenses', function (Blueprint $table) {
                $table->id()->autoIncrement();
                $table->integer('Amount');
                $table->string('Description',100)->nullable();
                $table->enum('Transaction_type',['cash','bank_transfer','check','orange_money'])->default('cash');
                $table->enum('Category',['Autre','Idrissa','Papelaria_Bah','Salaire_Prof','Salaire_Menor','Salaire_Autre','Courant','Segurança_Imposto','Internet_orange','Produit_Hygiènique','Batiment'])->default('Autre');
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
        //
    }
};
