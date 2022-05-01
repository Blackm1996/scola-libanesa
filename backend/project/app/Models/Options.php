<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Options extends Model
{
    use HasFactory;
    protected $fillable = ["option_name","option_value"];
    public $timestamps = false;
    protected $connection = 'mysql';
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
