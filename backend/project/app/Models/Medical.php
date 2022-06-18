<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medical extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    protected $table ="medical";
    public $timestamps = false;
    public $fillable=["Name","id_student","Description"];
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
