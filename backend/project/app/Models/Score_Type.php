<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Score_Type extends Model
{
   use HasFactory;
    protected $connection = 'mysql';
    protected $table ="score_types";
    protected $fillable=["id_course","semester","Name"];
    public $timestamps = false;
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
