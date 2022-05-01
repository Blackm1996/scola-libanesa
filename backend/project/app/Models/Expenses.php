<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expenses extends Model
{
    use HasFactory;
    protected $table ="expenses";
    protected $connection = 'mysql';
      public $timestamps = false;
    protected $fillable = ['Amount','Description','transaction_type','Date','School_Year'];

}
