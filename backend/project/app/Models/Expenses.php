<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expenses extends Model
{
    use HasFactory;
    protected $table ="expenses";
    protected $connection = 'mysql';
    protected $fillable = ['Amount','Description','Transaction_type','Category'];

    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }

}
