<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    protected $fillable=["id_classroom","id_course","id_instructor"];
    public $timestamps = false; 


}
