<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grades extends Model
{

    use HasFactory;
    protected $fillable =["Name" ,"Default_Inscription_tax","Default_Monthly_pay","Default_Books_Uniform_total"];
    public $timestamps = false;
    protected $connection = 'mysql';
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
