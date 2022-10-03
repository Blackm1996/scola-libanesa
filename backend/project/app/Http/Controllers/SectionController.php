<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Classroom;
use App\Models\Student_Inscription;
use App\Models\Student_Profile;
use App\Models\Grades;
use App\Models\Instructor;
use App\Models\Course;
use App\Models\Options;
use App\Models\Course_Info;
use Illuminate\Support\Arr;
use App\Utils\Birthday_List;
use DB;

class SectionController extends Controller
{
     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($School_Year)
    {
        try{
            $classr=Classroom::where("School_Year",$School_Year);
            $sections=Grades::leftJoinSub($classr,"Sections",function($join){
             $join->on("grades.id",'=','Sections.id_grade');
            })->get(['grades.Name as gradeName','grades.id as gradeId','Sections.Name as sectionName','Sections.id as sectionId']);
        $allSections = array();
        $tempsection = array();
        $oldgrade=0;
        foreach($sections as $section){
        if($oldgrade!=$section->gradeId ){
         if($oldgrade!=0){array_push($allSections,$tempsection);}
         $tempsection['gradeId']=$section->gradeId;
         $tempsection['gradeName']=$section->gradeName;
         $tempsection['sections']=array();
         $x=array();
         $oldgrade=$section->gradeId;
        }
        if($section->sectionName || $section->sectionId){
        $x['name']=$section->sectionName;
        $x['id']=$section->sectionId;
        array_push($tempsection['sections'],$x);
        }
       }
       array_push($allSections,$tempsection);}
       catch(\Throwable $e){
           return json_encode($e);
       }
        return json_encode($allSections);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

public function coursesForadmin($idSection)
{
    try{ 
        $semester_number=Options::select('option_value')->where('option_name','semester_number')->first();
        $semester_type=Options::select('option_value')->where('option_name','semester_type')->first();
         
        $course =Classroom::join('course_infos','course_infos.id_grade','classrooms.id_grade')->where('classrooms.id',$idSection)
        ->get(['course_infos.id','course_infos.Name']);
        $response['courses']=$course;
        $response['currentSemester']=$semester_number->option_value;
        $response['semesterType']=$semester_type->option_value;
        return $response;
    }
    catch(\Exception $e)
    {
        return response()->json(["status"=>$e],400);
    }
}


public function classinfos($id_section)
{
   $response = Course::join('instructors','instructors.id','courses.id_instructor')
   ->join('course_infos','course_infos.id','courses.id_course')
   ->where('courses.id_classroom',$id_section)
   ->get(['instructors.id as id_instructor','instructors.First_Name','instructors.Last_Name','course_infos.id as id_course','course_infos.Name']);
   return json_encode($response);
}

public function classStats($id_section)
{
    try{
       $response = array();
       $response["teachers"]=array();
       $response["courses"]=array();
$allInstructor=Instructor::get(['id','First_Name','Last_Name'])->toArray();;
$coursesRegistered=Course::join('course_infos','course_infos.id','courses.id_course')
->join('instructors','instructors.id','courses.id_instructor')
->where('courses.id_classroom',$id_section)
->get(['instructors.id','instructors.First_Name','instructors.Last_Name',"course_infos.id as id_course","course_infos.Name"]);

$allCourses=Course_Info::leftjoin('classrooms','classrooms.id_grade','course_infos.id_grade')
->where('classrooms.id',$id_section)
->groupBy('course_infos.id','course_infos.Name')
->get(["course_infos.id","course_infos.Name"]);
$temp=array() ;
//return json_encode($allCourses);
 foreach($allCourses as $course)
 {
   // echo $course->id.'\n';
   if($coursesRegistered->contains('id_course',$course->id)){
      // echo    '***'.$course->id.'***';
   $tempcourse =$coursesRegistered->firstWhere('id_course',$course->id);
   //echo  '***'.$tempcourse->id_course.'***';
    $temp['id_course']=$tempcourse->id_course;
    $temp['course_Name']=$tempcourse->Name;
    $temp['course_Last_Name']=$tempcourse->Last_Name;
    $temp['course_First_Name']=$tempcourse->First_Name;
    $temp['instructor_id']=$tempcourse->id;
    array_push($response["courses"],$temp);
   }
   else{
    $temp['id_course']=$course->id;
    $temp['course_Name']=$course->Name;
    $temp['course_Last_Name']=null;
    $temp['course_First_Name']=null;
    $temp['instructor_id']=null;
    array_push($response["courses"],$temp);}
 }

array_push($response["teachers"],$allInstructor);
return json_encode($response);
    }

    catch(\Exception $e)
    {
        return response()->json(["status"=>$e],400);
    }
}




    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
       public function store(Request $request)
    {
        try{
        $sectionID=Classroom::select('id')->where('Name',)->where('id_grade',$request->input('gradeId'))->
        where('School_Year',)->first();
        $Classroom  = new Classroom;
        $Classroom->Name        =  $request->input('sectionName');
        $Classroom->School_Year =  $request->input('School_Year');
        $Classroom->id_grade    =  $request->input('gradeId');
        $section=Classroom::FirstOrCreate($Classroom->toArray());
        foreach($request->input('students') as $student)
        {
          $newStudent = new Student_Inscription;
          Student_Inscription::where('id_student',$student)->where('id_grade',$request->input('gradeId'))->
          where('School_Year',$request->input('School_Year'))->update(['id_classroom'=>$section->id]);
        }
        foreach($request->input('selectedTeachers') as $course)
        {
           $newCourse= new Course;
           $newCourse->id_course=$course['idCourse'];
           $newCourse->id_classroom=$section->id;
           $newCourse->id_instructor=$course['idTeacher'];
           Course::firstOrCreate($newCourse->toArray());
        }   
    }
    catch(\Exception $e)
    {
        return json_encode($e);
    }
    return response()->json('data updated successfully',200);
  }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

   
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
      try{
        if(isset($request->sectionName)){
            Classroom::where('School_Year',$request->School_Year)->where('id',$id)->update(['Name'=>$request->sectionName]);
        }
        if(isset($request->removedStudents)){
          foreach($request->removedStudents as $removed)
          {
              Student_Inscription::where('id_student',$removed)->where('School_Year',$request->School_Year)->update(['id_classroom'=>null]);
          }
        }
        if(isset($request->addedStudents)){
           foreach($request->addedStudents as $added)
           {
            Student_Inscription::where('id_student',$added)->where('School_Year',$request->School_Year)->update(['id_classroom'=>$id]);
           }
        }
        if(isset($request->removedInstructor)){
           foreach($request->removedInstructor as $deletedInstructor)
           {
               Course::where('id_course',$deletedInstructor['idCourse'])
                    ->where('id_classroom',$id)
                    ->where('id_instructor',$deletedInstructor['idInstructor'])
                    ->delete();
           }
        }
        if(isset($request->addedInstructor)){
           foreach($request->addedInstructor as $newInstructor)
           {
               $newCourse =  new Course;
               $newCourse->id_course=$newInstructor['idCourse'];
               $newCourse->id_classroom=$id;
               $newCourse->id_instructor=$newInstructor['idInstructor'];
               Course::firstOrCreate($newCourse->toArray());
           }
        }
        return response()->json(['status'=>'data updated successfully'],200);
      }
    catch(\Exception $e)
      {
        return json_encode($e);
      }

    }


public function gradeStudents($idGrade,$School_Year)
{
    try{
   $gradeStudent=Student_Inscription::join('student_profiles','student_profiles.id','=','student_inscriptions.id_student')
   ->where('student_inscriptions.id_grade',$idGrade)->where('student_inscriptions.School_Year',$School_Year)->get([
       'student_profiles.id as id','student_profiles.First_Name as First_Name','student_profiles.Last_Name as Last_Name'
   ]);
   $gradeName=Grades::select('Name')->where('id',$idGrade)->first();
   $a=array();
    $a['gradeName']=$gradeName->Name;
   $a['students']=$gradeStudent->toArray();
   return json_encode($a);
}
catch(\Exception $e)
{
    return json_encode($e);
} 
}


public function sectionStudents($idSection,$School_Year)
{
    try{

    $sectionStudent=Student_Inscription::join('student_profiles','student_profiles.id','=','student_inscriptions.id_student')
   ->where('student_inscriptions.id_classroom',$idSection)->where('student_inscriptions.School_Year',$School_Year)->get([
       'student_profiles.id as id','student_profiles.First_Name as First_Name','student_profiles.Last_Name as Last_Name'
   ]);
     $sectionName=Classroom::select('classrooms.Name as className','grades.Name as gradeName')->join('grades','grades.id','classrooms.id_grade')->where('classrooms.id',$idSection)->where('classrooms.School_Year',$School_Year)->first();
   $a=array();
   $a['sectionName']=$sectionName->className;
   $a['gradeName']=$sectionName->gradeName;
   $a['students']=$sectionStudent->toArray();
   return json_encode($a);
}
   catch(\Exception $e)
   {
       return json_encode($e);
   }
}


public function missingStudents($id)
{
    
try{
$class=Classroom::join('grades','classrooms.id_grade','grades.id')->where('classrooms.id',$id)->first([
'grades.Name as gradeName',
'classrooms.id',	
'classrooms.Name',	
'classrooms.School_Year',	
'classrooms.id_grade']);


//$class=Classroom::findOrFail($id);
$response =  array();
$response['sectionName']=$class->Name;
$response['gradeName']=$class->gradeName;
$response['sectionStudent']=array();
$response['studentsNotDistributed']=array();

$studentIn= Student_Inscription::leftjoin('student_profiles','student_profiles.id','=','student_inscriptions.id_student')
->where('student_inscriptions.id_classroom',$id)->get([
    'student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name']);

  

$studentOut=Student_Inscription::leftjoin('student_profiles','student_profiles.id','=','student_inscriptions.id_student')
->where('student_inscriptions.School_Year',$class->School_Year)->where('student_inscriptions.id_grade',$class->id_grade)->where('id_classroom',null)->get([
    'student_profiles.id','student_profiles.First_Name','student_profiles.Last_Name']);



array_push($response['sectionStudent'],$studentIn->toArray());
array_push($response['studentsNotDistributed'],$studentOut->toArray());
return json_encode($response);
}
catch(\Exception $e){
    return json_encode($e);
}



}

public function birthDayList($idSection)
{
    try{
        $students = Student_Profile::select(DB::raw("CONCAT(First_Name,' ',Last_Name) AS name"),'Birthday')
        ->join('student_inscriptions','student_inscriptions.id_student','=','student_profiles.id')
      ->where('student_inscriptions.id_classroom',$idSection)->get();
        $section=Classroom::findOrFail($idSection);
        $title1=(Grades::select("Name")->where("id",$section->id_grade)->first())["Name"];
        $title=$title1."- ".$section->Name;
        $data=array("title"=>$title,"students"=>$students);
        $pdf=base64_encode(Birthday_List::generateList($data));
        }
        catch(\Exception $e)
        {
            return response()->json($e,400);
        }
        return json_encode($pdf);
}
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
         Classroom::where('id',$id)->delete();
        }
        catch(\Exception $e)
        {
            return json_encode($e);
        }
          return response()->json(['status'=>'section deleted successfully'],200);
        
        }


}
