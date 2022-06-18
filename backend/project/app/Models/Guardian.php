<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    protected $table ="guardian";
    public $timestamps = false;
    protected $fillable = ["Name","Profession","Address","Comm_Phone","is_Whats"];
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
