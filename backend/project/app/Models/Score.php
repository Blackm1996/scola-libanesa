<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    
    protected $fillable=["id_score_type","id_student","id_course","score","School_Year","final"];
    public $timestamps = false; 

}
