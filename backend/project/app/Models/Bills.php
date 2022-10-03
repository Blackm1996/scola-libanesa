<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bills extends Model
{
    use HasFactory;
    protected $fillable =["School_Year","Month","id_student","Amount","paymentType","Type","id_invoice"];
    
    protected $connection = 'mysql';
    
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
