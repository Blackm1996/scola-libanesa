<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Books extends Model
{
    use HasFactory;
    protected $fillable=["Name","id_grade"];
    public $timestamps = false;
    protected $connection = 'mysql';
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
