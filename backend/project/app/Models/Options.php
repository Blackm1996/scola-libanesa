<?php
/*
options:
start_month 9

end_month 6
	
semester_number 2
	
semester_type 2⁰P

School_Year 2021-2022
	
registration_year 2021-2022

*/
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
