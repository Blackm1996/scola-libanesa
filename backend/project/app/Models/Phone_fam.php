<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Phone_fam extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    protected $table ="phone_fam";
    public $timestamps = false;
    public $incrementing = false;
    protected $fillable = ["id_Owner","Phone_Nb","Owner_Type","is_Whats"];
    protected $primaryKey = ["Phone_Nb"];
    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
}
