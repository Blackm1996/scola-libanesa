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
use Illuminate\Support\Facades\Hash;

class InstructorController extends Controller
{

    /** 
     * Store a newly created resource in storage. 
     * 
     * @param  \Illuminate\Http\Request   $request 
     * @return \Illuminate\Http\Response 
     */  
public function store(Request $request)  
{  
try{
    $validation = $request->validate([
        'First_Name' =>  'required',
        'Last_Name' => 'required',
        'User_Name' => 'required',
        'Password' => 'required',
       // 'Email'=>'required',
       // 'Tel'=>'required',
       // 'time'=>'required',
    ]);
    
    $user  = new User;
    $user->email=$request->input('User_Name');
    $user->password=Hash::make($request->input('Password'));
    $user->role='instructor';
    $newUser = User::firstOrcreate($user->toArray());


    $instructor =  new Instructor;
    $instructor->First_Name =$request->input('First_Name');
    $instructor->Last_Name =$request->input('Last_Name');
    $instructor->Email =$request->input('Email');
    $instructor->Tel =$request->input('Tel');
    $instructor->Type =$request->input('Type');
    $instructor->id_user =$newUser->id;
    Instructor::firstOrcreate($instructor->toArray());
    
return response()->json(['status'=>'true'],204);
}    
catch(\Illuminate\Database\QueryException $e)
{
   return response()->json(["status"=>$e->errorInfo],404);
} 
catch(\Exception $e)
{
    return response()->json(["status"=>$e->errorInfo],400);
}
}  

public function deleteInstructor($id)
{
    try{
       if(Instructor::findOrFail($id)->delete())
       {
           return response()->json(["status"=>"true"],200);
       }
    }
    catch(\Exception $e){
       return response()->json(["status"=>"false"],400);
    }
}

public function teacherCoursesupdate($id,$School_Year)
{
$semester_number=Options::select('option_value')->where('option_name','semester_number')->first();
$semester_type=Options::select('option_value')->where('option_name','semester_type')->first();

$score_type=Score_Type::where('semester',$semester_number->option_value)->where('id_course',null)->where('Name',$semester_type->option_value)->first('id');

$courses=Course::select('courses.id_course','courses.id_classroom')
->join('classrooms','classrooms.id','courses.id_classroom')
->where('classrooms.School_Year',$School_Year)
->where('courses.id_instructor',$id)
->get();

$unsubbmitted=0;
$pending=0;
$submitted=0;
$response=array();
$unsubbmittedCourse=array();
$unsubbmittedCourse['coures']=array();
$response['unsubbmitted']['coures']=array();
$response['subbmitted']['coures']=array();
$response['pending']['coures']=array();
$response['name']=$semester_number->option_value.'st Trimester';

foreach($courses as $course){
    $courseName=Course_Info::select('Name')->where('id',$course->id_course)->first();
    $count=Score::where('id_score_type',$score_type->id)->where('School_Year',$School_Year)->where('id_course',$course->id_course)->count();
    if($count==0)
    {
        $temp=array();
        $unsubbmitted++;
        $response['unsubbmitted']['count']=$unsubbmitted;
    
        $class_grade_Name=Classroom::select('grades.Name as gradeName','classrooms.Name as className')
        ->join('grades','grades.id','classrooms.id_grade')
        ->where('classrooms.id',$course->id_classroom)->first();

        $temp['name']=$class_grade_Name->gradeName.' '.$class_grade_Name->className.': '.$courseName->Name;
        $temp['idSection']=$course->id_classroom;
        $temp['idCourse']=$course->id_course;
    
        array_push($response['unsubbmitted']['coures'],$temp);
    }
    else{
  $count=Score::where('id_score_type',$score_type->id)->where('School_Year',$School_Year)->where('id_course',$course->id_course)->where('final','0')->count();  
  if($count>0)
     { 
        $temp=array();
        $pending++;
        $response['pending']['count']=$pending;
   
        $class_grade_Name=Classroom::select('grades.Name as gradeName','classrooms.Name as className')
        ->join('grades','grades.id','classrooms.id_grade')
        ->where('classrooms.id',$course->id_classroom)->first();

        $temp['name']=$class_grade_Name->gradeName.' '.$class_grade_Name->className.': '.$courseName->Name;
        $temp['idSection']=$course->id_classroom;
        $temp['idCourse']=$course->id_course;

        array_push($response['pending']['coures'],$temp);
     }  
     else
     {
        $temp=array();
        $submitted++;
        $response['subbmitted']['count']=$submitted;

        $class_grade_Name=Classroom::select('grades.Name as gradeName','classrooms.Name as className')
        ->join('grades','grades.id','classrooms.id_grade')
        ->where('classrooms.id',$course->id_classroom)->first();

        $temp['name']=$class_grade_Name->gradeName.' '.$class_grade_Name->className.': '.$courseName->Name;
        $temp['idSection']=$course->id_classroom;
        $temp['idCourse']=$course->id_course;

        array_push($response['subbmitted']['coures'],$temp);

     }

    }
}

return json_encode($response);
}




public function classTeachers($id)
{
    try{
$teachers=Classroom::join('courses','courses.id_classroom','classrooms.id')->join('instructors','instructors.id','courses.id_instructor')->
join('course_infos','course_infos.id','courses.id_course')->where('classrooms.id',$id)
->get(['course_infos.Name','instructors.First_Name','instructors.Last_Name']);
return json_encode($teachers);
    }
    catch(\Exception $e)
    {
        return json_encode($e);
    }
}

public function allTeachercourses($id,$School_Year)
{

    $courses =Course::join('classrooms','classrooms.id','courses.id_classroom')
    ->join('course_infos','courses.id_course','course_infos.id')
    ->join('grades','grades.id','course_infos.id_grade')
    ->where('School_Year',$School_Year)
    ->where('courses.id_instructor',$id)->get(['grades.Name as gradeName','course_infos.id_grade','id_course','id_classroom','classrooms.Name as sectionName','course_infos.Name as courseName']);
    $response=array();
    $temp=array();
    $firstTime=true;
    foreach($courses as $course)
    {
     if( $firstTime || $temp['gradeId']!=$course->id_grade )
     {
       if(!$firstTime)
       {
           array_push($response,$temp);
       }
       $temp['gradeId']=$course->id_grade;
       $temp['gradeName']=$course->gradeName;
       $tempCourse=array();
       $temp['courses']=array();
       $firstTime=false;
     }
    $tempCourse['name']=$course->sectionName.' :'.$course->courseName;
    $tempCourse['idSection']=$course->id_classroom;
    $tempCourse['idCourse']=$course->id_course;
    array_push($temp['courses'],$tempCourse);
    }
    
    if(empty($temp)){return json_encode($response);}
    array_push($response,$temp);
    return json_encode($response);
}



}
