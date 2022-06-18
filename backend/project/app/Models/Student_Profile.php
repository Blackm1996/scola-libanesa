<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student_Profile extends Model
{
    use HasFactory;
    protected $fillable=["First_Name","Last_Name","Birthday","Birthplace","Nationality","id_family","Sex","id_guardian","ID_URL","Vaccine_URL"];
    protected $table ="student_profiles";
    public $timestamps = false;
    protected $connection ='mysql';

    public static function setCsetConnection($connection)
    {
        $connection =$connection ;
    }
}
