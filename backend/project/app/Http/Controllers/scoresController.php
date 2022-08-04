<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Score_Type;
use App\Models\Student_Profile;
use App\Models\Score;
use App\Models\Course_Info;
use App\Models\Course;
use App\Models\Options;
use App\Models\Classroom;
use App\Models\Student_Inscription;

class scoresController extends Controller
{

public function classScores($idSection)
{
    $response =array();
    $School_Year=Options::where('option_name','School_Year')->get(['option_value']);
    $students=Student_Inscription::where('School_Year',$School_Year[0]->option_value)
    ->where('id_classroom',$idSection)->where('Attending',1)->get(['id_student']);
    foreach($students as $student){
       $content= scoresController::totalScores($student->id_student);
       //$content=file_get_contents($content);
       $array = json_decode($content, true);
       //$id= $array['Status'];
       if(isset($array['Status'])){
      array_push($response,null);     
       }
      array_push($response,$array);
    }
    usort($response,function ($a,$b){
            if ( $a['Totalmoyen'] == $b['Totalmoyen'])
              return 0;
            return ($a['Totalmoyen'] < $b['Totalmoyen']) ? 1 : -1;
          });
    return $response; 
}

public  function totalScores($idStudent)
{
   $n=0;
      
    $semester_number=Options::where('option_name','semester_number')->get(['option_value']);
      
    $semester_type=Options::where('option_name','semester_type')->get(['option_value']);
 
  $semestersType= DB::table('score_types')->distinct('Name')->get('Name');
     $semesters = DB::table('score_types')->distinct('semester')->count('semester');
    
    $School_Year=Options::where('option_name','School_Year')->get(['option_value']);
    
    $studentInfo=Student_Inscription::join('student_profiles','student_profiles.id','student_inscriptions.id_student')
    ->join('grades','grades.id','student_inscriptions.id_grade')
    ->join('classrooms','classrooms.id','student_inscriptions.id_classroom')
    ->where('student_inscriptions.id_student',$idStudent)
    ->where('student_inscriptions.School_Year',$School_Year[0]->option_value)
    ->get(['student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name','student_inscriptions.School_Year',
    'grades.Name as gradeName','classrooms.Name as sectionName']);
   
    $studentcourses=Student_Inscription::join('course_infos','course_infos.id_grade','student_inscriptions.id_grade')
    ->where('student_inscriptions.id_student',$idStudent)
    ->where('course_infos.included',1)
    ->where('student_inscriptions.School_Year',$School_Year[0]->option_value)
    ->get(['course_infos.id','course_infos.Name','course_infos.score']);
 
    $scores=array(count($studentcourses));
    $coursesCount = count($studentcourses);
    $response = array();
    $response['studentDetails']=$studentInfo[0]->toArray();
    
     /*  $tempsemester=Score_Type::select()
           ->where('semester','1')
           ->where('Name','1⁰P')->first();
       return $tempsemester;*/

    $courseDetails=array();
    $max=0;
    $response['langScores']=array();
      // return $semesters;
    for($i=0;$i<$coursesCount;$i++)
    {
     $scores[$i]=array();
     $max+=$studentcourses[$i]->score;
    for($semester=1;$semester<=$semesters;$semester++){
        foreach($semestersType as $type)
        {
         $tempsemester=Score_Type::select()
           ->where('semester',$semester)
           ->where('Name',$type->Name)->first();

        if(!Student_Inscription::leftjoin('scores','scores.id_student','student_inscriptions.id_student')
           ->leftjoin('course_infos','course_infos.id','scores.id_course')
           ->where('student_inscriptions.id_student',$idStudent)
           ->where('scores.id_course',$studentcourses[$i]->id)
           ->where('course_infos.included',1)
           ->where('student_inscriptions.School_Year',$School_Year[0]->option_value)
           ->where('scores.id_score_type',$tempsemester->id)->exists())
        {
         //$n++;
         array_push($scores[$i],null);
         // return response()->json(["response"=>false],401);
        }else
           {
           $trimsterScores=Student_Inscription::leftjoin('scores','scores.id_student','student_inscriptions.id_student')
           ->leftjoin('course_infos','course_infos.id','scores.id_course')
           ->where('student_inscriptions.id_student',$idStudent)
           ->where('course_infos.included',1)
           ->where('scores.id_course',$studentcourses[$i]->id)
           ->where('student_inscriptions.School_Year',$School_Year[0]->option_value)
           ->where('scores.id_score_type',$tempsemester->id)->get([
               'scores.score as score']);
               array_push($scores[$i],$trimsterScores[0]->score);
           // return json_encode($trimsterScores[0]);
          // return $scores[0];
           }
        }
       }
    $courseDetails['langName']=$studentcourses[$i]->Name;
    $courseDetails['coefficient']=$studentcourses[$i]->score;
    $courseDetails['scores']=$scores[$i];
    array_push($response['langScores'],$courseDetails);
    }

$total=array(count($scores[0]));
$moyen=array(count($scores[0]));
$coefficient=$max;
/*for($i=0;$i<count($scores[0]);$i++)
{
    if($i<$coursesCount){
    $coefficient+=$studentcourses[$i]->score;}
}*/
$tempTotal=0;
$moyenTotal=0;
$examsNumber=0;
for($i=0;$i<count($scores[0]);$i++)
{
    foreach($scores as $score)
    {
       $tempTotal+= $score[$i];
    }
    if($tempTotal!=0){$examsNumber++;}
    $total[$i]=$tempTotal;
    $moyen[$i]=(20*$tempTotal)/$coefficient;
    $moyen[$i]=number_format($moyen[$i],2);
    $moyenTotal+=$moyen[$i];
    $tempTotal=0;
}
$moyenCoefficient=$coefficient/$coursesCount;
   if($examsNumber==0){$moyenTotal=0;}else{
   $moyenTotal=($moyenTotal)/$examsNumber;
   $moyenTotal=number_format($moyenTotal,2);}
      
   $response['total']['coefficient']=$coefficient;
   $response['total']['scores']=$total;
   $response['moyenne']['coefficient']=20;
   $response['moyenne']['scores']=$moyen;
   $response['Totalmoyen']=$moyenTotal;
    return json_encode($response);
}
 
    
     public function adminSave(Request $request)
    {
        try{
    if(Score::where('id_score_type',$request->input('id_score_type'))
      ->where('id_student',$request->input('id_student'))
      ->where('id_course',$request->input('id_course'))
      ->where('School_Year',$request->input('School_Year'))
      ->exists())
      {
        Score::where('id_score_type',$request->input('id_score_type'))
      ->where('id_student',$request->input('id_student'))
      ->where('id_course',$request->input('id_course'))
      ->where('School_Year',$request->input('School_Year'))
      ->update(["score"=>$request->score,"final"=>"1"]);
      }
else{
      Score::create($request->all());}
      }
        catch(\Exception $e)
        {
            return response()->json($e,404);
        }
       return response()->json(["status"=>"Data inserted succefully"],200);
    }







    public function getfirstgrade($idSection)
    {
        $studentsCount= Student_Inscription::where('id_classroom',$idSection)->count();
        $semester_number=Options::select('option_value')->where('option_name','semester_number')->first();
        $semester_type=Options::select('option_value')->where('option_name','semester_type')->first();
    
        $id_score_type= Score::select(['scores.id_score_type',DB::raw("SUM(score)/$studentsCount as total_points")])->
        join('student_inscriptions','student_inscriptions.id_student','scores.id_student')
        ->where('student_inscriptions.id_classroom',$idSection)->groupBy('scores.id_score_type');

       $average= DB::table( DB::raw("({$id_score_type->toSql()}) as sub") )->mergeBindings($id_score_type->getQuery())
        ->select(DB::raw("SUM(total_points) as average"))->get()->toArray();
         $response = array();
         $response['studentsCount']=$studentsCount;
         $response['lastTrimesterAVerage']=$average[0]->average;
         array_push($average,$studentsCount);
        return json_encode($response);
    }

    public function save(Request $request)
    {
        try{
    if(Score::where('id_score_type',$request->input('id_score_type'))
      ->where('id_student',$request->input('id_student'))
      ->where('id_course',$request->input('id_course'))
      ->where('School_Year',$request->input('School_Year'))
      ->where('scores.final','1')
      ->exists())
       {
          return response()->json(["status"=>"you can't modify this score anymore"],400);
       }
    if(Score::where('id_score_type',$request->input('id_score_type'))
      ->where('id_student',$request->input('id_student'))
      ->where('id_course',$request->input('id_course'))
      ->where('School_Year',$request->input('School_Year'))
      ->exists())
      {
        Score::where('id_score_type',$request->input('id_score_type'))
      ->where('id_student',$request->input('id_student'))
      ->where('id_course',$request->input('id_course'))
      ->where('School_Year',$request->input('School_Year'))
      ->update(["score"=>$request->score]);
      }
else{
      Score::create($request->all());}
    
      }
        catch(\Exception $e)
        {
            return response()->json($e,404);
        }
       return response()->json(["status"=>"Data inserted succefully"],200);
    }

      public function update($idSection,$idCourse)
    {

       
        $semester_number=Options::where('option_name','semester_number')->get(['option_value']);
      
        $semester_type=Options::where('option_name','semester_type')->get(['option_value']);

         $scoreType=Score_Type::select()
           ->where('semester',$semester_number[0]->option_value)
           ->where('Name',$semester_type[0]->option_value)->first();
            

       $allStudent=Student_Inscription::where('id_classroom',$idSection)->count();
       $currentSubmitted=Score::join('student_inscriptions','student_inscriptions.id_student','scores.id_student')
       ->where('student_inscriptions.id_classroom',$idSection)
       ->where('scores.id_course',$idCourse)
       ->where('scores.id_score_type',$scoreType->id)
       ->count();
       if($allStudent!=$currentSubmitted)
       {
           return response()->json(["status"=>"you haven't added all student scores"],400);
       }
       else{
           Score::join('student_inscriptions','student_inscriptions.id_student','scores.id_student')
           ->where('student_inscriptions.id_classroom',$idSection)
           ->where('scores.id_course',$idCourse)
           ->where('scores.id_score_type',$scoreType->id)
           ->update(["final"=>"1"]);
           return json_encode("data updated succefully");
       }
    }
  
}
