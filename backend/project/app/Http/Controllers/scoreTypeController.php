<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Instructor;
use App\Models\User;
use App\Models\Course;
use App\Models\Classroom;
use App\Models\grades;
use App\Models\Course_Info;
use App\Models\Score;
use App\Models\Score_Type;
use App\Models\Options;
use App\Models\Student_Inscription;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
class scoreTypeController extends Controller
{
         /** 
     * Display a listing of the resource. 
     * @return \Illuminate\Http\Response 
     */  
public function index($School_Year,$id_classroom,$semester,$type)  
{  
    $firstTime=true;
    $arrayScore=array();

    $courses=array();
    $i=0;
      $semester_number=Options::where('option_name','semester_number')->get(['option_value']);
      
      $semester_type=Options::where('option_name','semester_type')->get(['option_value']);

    $count=Student_Inscription::where('id_classroom',$id_classroom)->where('School_Year',$School_Year)->count();
    $allstudent=Student_Inscription::join('student_profiles','student_profiles.id','student_inscriptions.id_student')->where('id_classroom',$id_classroom)->where('School_Year',$School_Year)->orderBy('id_student')->get(['student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name']);
     $studentId=array();
    foreach($allstudent as $student)
    {
     array_push($studentId,$student->id);
      $arrayScore[$student->id]['Last_Name']=$student->Last_Name;
      $arrayScore[$student->id]['First_Name']=$student->First_Name;
      $arrayScore[$student->id]['values']=array(); 
    }
    //array_push($tempScores);

    $scoreTypeid=Score_Type::select()
           ->where('semester',$semester)
           ->where('Name',$type)->first();
            
    $Courses=Course_Info::select('course_infos.id','course_infos.Name')
    ->leftjoin('classrooms','classrooms.id_grade','course_infos.id_grade')
    ->where('classrooms.id',$id_classroom)
    ->get();
    
    /*$coursesCount=Score_Type::select("score_types.id",'score_types.id_course','course_infos.Name')
    ->leftjoin('classrooms','classrooms.id_grade','course_infos.id_grade')
    ->leftjoin('courses','courses.id_course','score_types.id_course')
    ->leftjoin('course_infos','course_infos.id','score_types.id_course')
    ->where('classrooms.id',$id_classroom)
    ->where('score_types.semester',$semester)
    ->where('score_types.Name',$type)
    ->count();
    return $coursesCount;*/
    $temp=0;
    //return json_encode($scoreTypeid);
   foreach($Courses as $tempCourse)
   {
    array_push($courses,$tempCourse->Name);
 
       for($k=0 ; $k<$count ;$k++){
      $arrayScore[$studentId[$k]]['values'][$temp]="null";
       }
      
   
   
    $courseScores=Score::leftjoin('student_inscriptions','student_inscriptions.id_student','scores.id_student')
   ->leftjoin('student_profiles','student_profiles.id','student_inscriptions.id_student')
   ->where('scores.id_course',$tempCourse->id)
   ->where('scores.id_score_type',$scoreTypeid->id)
   ->where('student_inscriptions.id_classroom',$id_classroom)->orderBy('student_inscriptions.id_student')
   ->get(['student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name','scores.score']);
     //return json_encode($courseScores);
    
    foreach($courseScores as $score)
    { 
      $arrayScore[$score->id]['values'][$temp]=$score->score;
    }
    $temp++;
   }
   $response['courses']=array();
   $response['scores']=array();
   foreach($courses as $course){array_push($response['courses'],$course);}
   /*foreach($arrayScore as $score){
       array_push($response['scores'],$score);
       }*/

    $i=0;  
       foreach($allstudent as $student)
    {
      array_push($response['scores'],$arrayScore[$student->id]);  
    }
   return json_encode($response); 
}  


 
public function getStatus($id_classroom,$id_course)
{
$semester_number=Options::select('option_value')->where('option_name','semester_number')->first();
$semester_type=Options::select('option_value')->where('option_name','semester_type')->first();

$maxScore = Course_Info::select('score')->where('id',$id_course)->first();

$scoreType=Score_Type::select()
           ->where('semester',$semester_number->option_value)
           ->where('Name',$semester_type->option_value)->first();
            

$scores=Score::leftjoin('student_inscriptions','student_inscriptions.id_student','scores.id_student')
  ->leftjoin('student_profiles','student_profiles.id','student_inscriptions.id_student')
  ->leftjoin('course_infos','scores.id_course','course_infos.id')
  ->where('student_inscriptions.id_classroom',$id_classroom)
  ->where('scores.id_score_type',$scoreType->id)
  ->where('scores.id_course',$id_course)->get(['student_inscriptions.id_student','scores.id_score_type as id_score_type','course_infos.score as maxScore','student_profiles.First_Name'
  ,'student_profiles.Last_Name','scores.score','scores.final']);

  $allstudent=Student_Inscription::join('student_profiles','student_profiles.id','student_inscriptions.id_student')
  ->where('id_classroom',$id_classroom)->get(['First_Name',"Last_Name","student_inscriptions.id_student"]);
   $response = new Collection();
  foreach($allstudent as $student)
  {  
  
    if(!($scores->contains('id_student',$student->id_student)))
    {
      $object=["id_student"=>$student->id_student,
               "id_score_type"=>$scoreType->id,
               "maxScore"=>$maxScore->score,
              "First_Name"=>$student->First_Name,
              "Last_Name"=>$student->Last_Name,
              "score"=>"",
              "final"=>"0"];
      $object['semester']=$semester_number->option_value;
      $object["semesterType"]=$semester_type->option_value;
      $response->push($object);
    }
    else
    {
      $object= $scores->firstWhere('id_student',$student->id_student);
      $object["semester"]=$semester_number->option_value;
      $object["semesterType"]=$semester_type->option_value;
      $response->push($object);
    }
  }

 return json_encode($response);
}


}
