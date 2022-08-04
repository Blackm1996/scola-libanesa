<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;
    protected $table ="invoice";
    protected $connection = 'mysql';
    protected $fillable = ['id_family','Amount','Description','Classes','Students','School_Year'];

    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }

}
