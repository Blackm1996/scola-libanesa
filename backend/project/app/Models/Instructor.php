<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    protected $fillable = ["First_Name","Last_Name","Tel","Email","Type","id_user"];
    public $timestamps = false;
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
