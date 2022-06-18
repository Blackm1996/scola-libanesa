<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    protected $table ="medicine";
    public $timestamps = false;
    public $fillable=["Name","id_student"];
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
