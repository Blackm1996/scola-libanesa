<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Family extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    protected $table ="family";
    public $timestamps = false;
    protected $fillable = ["Father_Name","Father_Profession","Father_Address","Mother_Name"
                ,"Mother_Profession","Mother_Address","Comm_Phone","Comm_Owner","is_Whats"];
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
