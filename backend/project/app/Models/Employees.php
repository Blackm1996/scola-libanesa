<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employees extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    protected $table ="employees";
    protected $fillable = ["First_Name","Last_Name","Tel","Address","Type","Birthday","Nationality","position","base_salary"];
    public $timestamps = false;
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
