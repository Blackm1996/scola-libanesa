<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student_inscription extends Model
{
    use HasFactory;
  protected $table ="student_inscriptions";
  protected $connection = 'mysql';

  protected $primaryKey = ['id_student', 'id_grade','School_Year'];
  public $incrementing = false;
   protected $fillable=["id_student","id_grade","School_Year","Inscription_Tax","Monthly_Total","Month_Start","id_classroom","Books_Uniform_total","Discount","Attending"];

 
  }
