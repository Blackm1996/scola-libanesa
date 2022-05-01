<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
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
class CourseController extends Controller
{

    /*
    public function __construct(){

        $this->middleware('auth');
    }*/


     /** 
     * Display a listing of the resource. 
     * @return \Illuminate\Http\Response 
     */  
public function index()  
{  
          
//  
      
}  
/** 
     * Show the form for creating a new resource. 
     * @return \Illuminate\Http\Response 
       
*/  
 public function create()  
{  
}
      

public function allcourses($id_grade)
{
    try{
$response = array();
$response["teachers"]=Instructor::get(["id","First_Name","Last_Name"])->toArray();
$response["courses"]=Course_Info::where('id_grade',$id_grade)->get(["id","Name"])->toArray();
return json_encode($response);
    }

    catch(\Exception $e)
    {
        return respone()->json(["status"=>$e],400);
    }
}

  
/** 
     * Store a newly created resource in storage. 
     * 
     * @param  \Illuminate\Http\Request   $request 
     * @return \Illuminate\Http\Response 
     */  
public function store(Request $request)  
{  
          
//  
      
}  
/** 
     * Display the specified resource. 
     * @param  int  $id 
     * @return \Illuminate\Http\Response 
     */  
public function show($id)  
{  
    try{
  $course= Course_Info::select('id','Name','score')->where('id_grade',$id)->get();
  }
  catch(\Exception $e){
      return response()->json('the course you looking for is not found',404);
  }
  return response()->json($course,200);

}  
/** 
     * Show the form for editing the specified resource. 
     * @param  int  $id 
     * @return  \Illuminate\Http\Response 
     */  
 public function edit($id)  
      
{  
          
//  
      
}
  

/** 
     * Update the specified resource in storage. 
     * @param  \Illuminate\Http\Request   $request 
     * @param  int  $id 
     * @return \Illuminate\Http\Response 
     */  
 public function update(Request $request, $id)  
{   
    try{
      if(isset($request->addedCourses)){
     foreach($request->addedCourses as $courses){
        $validation = Validator::make($courses,[
            'courses.Name' => 'required',
            'courses.score'=>'required|numeric'  
        ]);
         //  add a new course 
         $newcourse= new Course_Info;
        $newcourse->Name=$courses['Name'];
        $newcourse->id_grade=$id;
        $newcourse->score=$courses['score'];
    $myCourse=  Course_Info::firstOrCreate($newcourse->toArray());
      }}




    if(isset($request->deletedCourses))
    {
     foreach($request->deletedCourses as $deleted){
      $validation = Validator::make($request->deletedCourses,[
          '$deleted'=>'required|numeric'
      ]);
      // delete the old course
      Course_Info::where('id',$deleted)->delete();        
        
    }}
}
catch(\Exception $e){
    return response()->json(null, 204);
   }
   return response()->json("data updated succesfully",200); 
    

     
}  




/** 
     * Remove the specified resource from storage. 
     * @param  int  $id 
     * @return  \Illuminate\Http\Response 
     */  
 public function destroy($id)  
 {  
    try{
        Course_Info::where('id',$id)->delete();
    }
    catch(\Exception $e){
        return response()->json('Error,something happend',500);
    }

    return response()->json(null, 204);

 }
}
