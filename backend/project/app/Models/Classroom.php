<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;
    protected $fillable =["Name","School_Year","id_grade"];
    protected $table ="classrooms";
   public $timestamps = false;
   protected $connection = 'mysql';
   public function setCsetConnection($connection)
   {
       $this->$connection =$connection ;
   }
}
