<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeHourlyAttendance extends Model
{
    use HasFactory;
    protected $table ="attendance_hourly";
    protected $connection = 'mysql';
    public $timestamps = false;
    protected $primaryKey = ['id_employee', 'for_day'];
    public $incrementing = false;
    protected $fillable=['id_employee', 'for_day','hours','minutes'];

    public function setCsetConnection($connection)
    {
        $this->$connection =$connection ;
    }
  }
