<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course_Info extends Model
{
    use HasFactory;
    protected $table ="course_infos";
    protected $fillable=["Name","id_grade","score"];
    public $timestamps = false;
    protected $connection = 'mysql';
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
